<?php
session_start();
include 'config.php';
if(isset($_POST['login'])){
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    $res = $conn->query("SELECT * FROM users WHERE username='$user' AND password='$pass'");
    if($res->num_rows==1) $_SESSION['admin']=$res->fetch_assoc();
    else echo "<script>alert('Wrong credentials')</script>";
}
if(isset($_GET['logout'])){session_destroy();header("Location:admin.php");}
if(!isset($_SESSION['admin'])){
    echo '
    <style>body{max-width:400px;margin:40px auto;font-family:Arial}</style>
    <h2>Login</h2>
    <form method=post>
        <input name=user placeholder=Username required><br><br>
        <input name=pass type=password placeholder=Password required><br><br>
        <button name=login>Login</button>
    </form>
    '; exit;
}
$me = $_SESSION['admin'];
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
    <style>
        *{box-sizing:border-box;margin:0;padding:0;font-family:Arial}
        body{background:#f5f7fa;padding:20px;max-width:1200px;margin:auto}
        .box{background:white;padding:20px;border-radius:10px;margin-bottom:20px}
        h2,h3{border-bottom:1px solid #eee;padding-bottom:10px;margin-bottom:15px}
        input,textarea,select{width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:6px}
        button{padding:10px 15px;background:#3498db;color:white;border:none;border-radius:6px;cursor:pointer;margin:5px}
        .btn-red{background:#e74c3c}
        .preview{border:2px dashed #aaa;padding:20px;min-height:400px;position:relative;background:#f9f9f9}
        .drag-block{position:absolute;padding:15px;background:white;border:2px solid #3498db;border-radius:8px;cursor:move}
        .resize{position:absolute;right:0;bottom:0;width:15px;height:15px;background:#3498db;cursor:se-resize}
        .flex{display:flex;gap:10px;flex-wrap:wrap}
    </style>
</head>
<body>
<div class=box>
    <h2>Welcome, <?=$me['name']?> | <a href=?logout>Logout</a></h2>
</div>

<?php if($me['role']=='master'){ ?>
<div class=box>
    <h3>Master Website Settings</h3>
    <?php $cfg = $conn->query("SELECT * FROM config WHERE id=1")->fetch_assoc(); ?>
    <form method=post action=save.php>
        <input name=title value="<?=$cfg['title']?>">
        <input name=subtitle value="<?=$cfg['subtitle']?>">
        <div class=flex>
            <input name=header_bg type=color value="<?=$cfg['header_bg']?>">
            <input name=header_color type=color value="<?=$cfg['header_color']?>">
        </div>
        <button name=save_master>Save Global Design</button>
    </form>
</div>
<?php } ?>

<div class=box>
    <h3>My Programs</h3>
    <form method=post action=save.php>
        <input name=new_program placeholder="New Program Name">
        <button name=create_program>Create</button>
    </form>
    <?php
    $uid = $me['id'];
    $progs = $conn->query("SELECT * FROM programs WHERE owner=$uid OR id IN (SELECT program_id FROM permissions WHERE user_id=$uid)");
    while($p=$progs->fetch_assoc()){
        echo "<p>• ".$p['name']."</p>";
    }
    ?>
</div>

<div class=box>
    <h3>Block Editor</h3>
    <select id=prog_select>
        <?php $progs->data_seek(0); while($p=$progs->fetch_assoc()){ ?>
            <option value="<?=$p['id']?>"><?=$p['name']?></option>
        <?php } ?>
    </select>
    <button onclick=addBlock()>Add Block</button>
    <button onclick=deleteBlock() class=btn-red>Delete Selected</button>
    <input id=block_title placeholder="Block Title">
    <textarea id=block_content rows=4 placeholder="Content / HTML"></textarea>
    <div class=flex>
        <input type=color id=block_bg>
        <input type=color id=block_text>
        <input type=color id=block_border>
    </div>
    <button onclick=saveBlock()>Save Block</button>
</div>

<div class=box>
    <h3>Drag & Drop Layout</h3>
    <div id=preview class=preview></div>
    <button onclick=saveLayout()>Save Positions & Sizes</button>
</div>

<script>
let selectedBlock = null;
let drag = null, resize = null;

function loadPreview(){
    let pid = document.getElementById('prog_select').value;
    fetch(`get_blocks.php?pid=${pid}`)
    .then(r=>r.json())
    .then(data=>{
        let p = document.getElementById('preview');
        p.innerHTML = '';
        data.forEach(b=>{
            let d = document.createElement('div');
            d.className = 'drag-block';
            d.dataset.id = b.id;
            d.innerText = b.title;
            d.style.left = b.x+'%';
            d.style.top = b.y+'%';
            d.style.width = b.w+'%';
            d.style.height = b.h+'%';
            d.innerHTML += '<div class=resize></div>';
            d.onclick = ()=>{selectedBlock=b;document.getElementById('block_title').value=b.title;document.getElementById('block_content').value=b.content;};
            p.appendChild(d);
        });
    });
}

document.getElementById('prog_select').onchange = loadPreview;
loadPreview();

document.getElementById('preview').onmousedown = e=>{
    if(e.target.classList.contains('resize')) resize=e.target.parentElement;
    else if(e.target.classList.contains('drag-block')) drag=e.target;
}

document.onmousemove = e=>{
    let r = document.getElementById('preview').getBoundingClientRect();
    if(drag){
        drag.style.left = Math.max(0, ((e.clientX-r.left)/r.width*100))+'%';
        drag.style.top = Math.max(0, ((e.clientY-r.top)/r.height*100))+'%';
    }
    if(resize){
        resize.style.width = Math.max(10, ((e.clientX-r.left)/r.width*100 - parseFloat(resize.style.left)))+'%';
        resize.style.height = Math.max(10, ((e.clientY-r.top)/r.height*100 - parseFloat(resize.style.top)))+'%';
    }
}

document.onmouseup = ()=>{drag=null;resize=null;}

function addBlock(){
    let pid = document.getElementById('prog_select').value;
    fetch(`save.php?add_block=1&pid=${pid}`).then(()=>loadPreview());
}

function deleteBlock(){
    if(!selectedBlock)return;
    fetch(`save.php?delete_block=${selectedBlock.id}`).then(()=>loadPreview());
}

function saveBlock(){
    if(!selectedBlock)return;
    let t = document.getElementById('block_title').value;
    let c = document.getElementById('block_content').value;
    let bg = document.getElementById('block_bg').value;
    let txt = document.getElementById('block_text').value;
    let bor = document.getElementById('block_border').value;
    fetch(`save.php?update_block=${selectedBlock.id}&title=${t}&content=${c}&bg=${bg}&text=${txt}&border=${bor}`)
    .then(()=>loadPreview());
}

function saveLayout(){
    let pid = document.getElementById('prog_select').value;
    let blocks = document.querySelectorAll('.drag-block');
    let data = [];
    blocks.forEach(b=>{
        data.push({
            id:b.dataset.id,
            x:parseFloat(b.style.left),
            y:parseFloat(b.style.top),
            w:parseFloat(b.style.width),
            h:parseFloat(b.style.height)
        });
    });
    fetch(`save.php?save_layout=1&pid=${pid}&data=`+JSON.stringify(data))
    .then(()=>alert('Layout Saved!'));
}
</script>
</body>
</html>
