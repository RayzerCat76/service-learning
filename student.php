<?php include 'config.php'; session_start();
$config = $conn->query("SELECT * FROM config WHERE id=1")->fetch_assoc();
$programs = $conn->query("SELECT * FROM programs");
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Service Learning</title>
    <style>
        * { box-sizing:border-box; margin:0; padding:0; font-family:<?=$config['tab_font']?>; }
        body { padding:20px; max-width:1200px; margin:0 auto; background:#f5f7fa; }
        .site-header {
            text-align:center; padding:20px; border-radius:10px;
            background:<?=$config['header_bg']?>;
            color:<?=$config['header_color']?>;
            margin-bottom:30px;
        }
        .tab-buttons { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
        .tab-btn {
            padding:12px 24px; border:none; border-radius:6px; cursor:pointer;
            background:<?=$config['tab_bg']?>;
            color:<?=$config['tab_color']?>;
            font-size:<?=$config['tab_size']?>;
        }
        .tab-btn.active {
            background:<?=$config['tab_active_bg']?>;
            color:<?=$config['tab_active_color']?>;
        }
        .tab-content {
            border-radius:10px; padding:25px; box-shadow:0 2px 10px rgba(0,0,0,0.1);
            display:none; position:relative; overflow:hidden;
        }
        .tab-content.active { display:block; }
        .tab-bg {
            position:absolute; top:0; left:0; width:100%; height:100%;
            background-size:cover; background-position:center; z-index:0;
        }
        .tab-inner { position:relative; z-index:1; }
        .dyn-block {
            margin-bottom:25px; padding:20px; border-radius:8px; border:2px solid;
        }
        .dyn-block img { max-width:100%; height:auto; border-radius:6px; margin:10px 0; }
        .news-list { max-height:400px; overflow-y:auto; }
    </style>
</head>
<body>
    <div class="site-header">
        <h1 style="font-size:<?=$config['header_size']?>;"><?=$config['title']?></h1>
        <p style="font-size:1.1rem;"><?=$config['subtitle']?></p>
    </div>

    <div class="tab-buttons">
        <?php $first=true; while($p=$programs->fetch_assoc()){ ?>
            <button class="tab-btn <?=$first?'active':''?>" data-tab="<?=$p['id']?>">
                <?=$p['name']?>
            </button>
        <?php $first=false; } ?>
    </div>

    <?php
    $programs->data_seek(0); $first=true;
    while($p=$programs->fetch_assoc()){
        $pid = $p['id'];
        $bg = $p['bg_type']=='image' ? "background-image:url({$p['bg_image']})" : "background-color:{$p['bg_color']}";
    ?>
    <div class="tab-content <?=$first?'active':''?>" id="tab-<?=$pid?>">
        <div class="tab-bg" style="<?=$bg?>"></div>
        <div class="tab-inner">
            <?php
            $blocks = $conn->query("SELECT * FROM blocks WHERE program_id=$pid ORDER BY position");
            while($b=$blocks->fetch_assoc()){
            ?>
            <div class="dyn-block" style="background:<?=$b['bg']?>;color:<?=$b['text_color']?>;border-color:<?=$b['border']?>;">
                <h2><?=$b['title']?></h2>
                <?=$b['content']?>
            </div>
            <?php } ?>
        </div>
    </div>
    <?php $first=false; } ?>

    <script>
        document.querySelectorAll('.tab-btn').forEach(btn=>{
            btn.onclick=()=>{
                document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
            }
        });
    </script>
</body>
</html>
