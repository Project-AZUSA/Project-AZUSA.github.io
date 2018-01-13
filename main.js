//Project AZUSA 2018
//Powered by FreeMote
//by Ulysses, wdwxy12345@gmail.com

function start() {
	// 获取窗口宽度
	if (window.innerWidth)
	winWidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth))
	winWidth = document.body.clientWidth;
	// 获取窗口高度
	if (window.innerHeight)
	winHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight))
	winHeight = document.body.clientHeight;
	// 通过深入 Document 内部对 body 进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
	{
	winHeight = document.documentElement.clientHeight;
	winWidth = document.documentElement.clientWidth;
	}

	// initialize emote player
    EmotePlayer.createRenderCanvas(winWidth, winHeight);
    const canvas = document.getElementById('canvas');	
    const player = new EmotePlayer(canvas);
	canvas.width = winWidth;
	canvas.height = winHeight;	
    player.scale = 0.7;
	c = player.coord;
	c[1] -= 40;
	player.coord = c;
    player.diffTimelineSlot4 = '差分用_waiting_loop2';

    // load data then, register mouse event
    player.promiseLoadDataFromURL("data/emote_test2.pure.emtbytes")
    .then(() => {
		document.getElementById('loading').innerHTML = "Done!";
		setTimeout(()=>
		{
			document.getElementById('loading').style.visibility = "hidden";
		},1000);
		player.setVariable("fade_z", 256);
		
        // mouse move eye tracking reaction
        const eyetracking_rection = (ev) => {
            const eyePosition = player.getMarkerPosition('eye');
            const mouseOffsetX = ev.clientX - eyePosition.clientX;
            const mouseOffsetY = ev.clientY - eyePosition.clientY;
            const angle = Math.atan2(mouseOffsetY, mouseOffsetX);
            const len = Math.sqrt(mouseOffsetX ** 2 + mouseOffsetY ** 2);
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            // eye tracking
            player.setVariableDiff('eyetrack', 'face_eye_LR', len / 3 * c, 500, -1);
            player.setVariableDiff('eyetrack', 'face_eye_UD', len / 3 * s, 500, -1);
            // head tracking
            if (len > 60) {
                player.setVariableDiff('eyetrack', 'head_slant', len / 12 * c, 1000, -1);
                player.setVariableDiff('eyetrack', 'head_LR', len / 6 * c, 1000, -1);
                player.setVariableDiff('eyetrack', 'head_UD', len / 6 * s, 1000, -1);
            }
            // body tracking
            if (len > 120) {
                player.setVariableDiff('eyetrack', 'body_slant', len / 18 * c, 2000, -1);
                player.setVariableDiff('eyetrack', 'body_LR', len / 9 * c, 2000, -1);
                player.setVariableDiff('eyetrack', 'body_UD', len / 9 * s, 2000, -1);
            }
        };
        // bind to mousemove event
        canvas.onmousemove = eyetracking_rection;
        // bind to mobile touch event
        canvas.addEventListener('touchmove', (ev) => {
            eyetracking_rection(ev.touches[0]);
            ev.preventDefault();
        }, false); 
		

		
		canvas.addEventListener("mousewheel", (ev) => {
			var delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail)));
			if((player.scale < 0.3 && delta < 0) || (player.scale > 1.5 && delta > 0))
				return;
			player.setScale(player.scale+delta * 0.05,100,0.5);
            ev.preventDefault();
        }, false);

        // mouse touch reaction
        let touching = false;
        const touch_reaction = (ev) => {
            if (touching)
                return;
            const bustPosition = player.getMarkerPosition('bust');
            const bustLength = Math.sqrt((bustPosition.clientX - ev.clientX) ** 2 + (bustPosition.clientY - ev.clientY) ** 2);
            const eyePosition = player.getMarkerPosition('eye');
            const eyeLength = Math.sqrt((eyePosition.clientX - ev.clientX) ** 2 + (eyePosition.clientY - ev.clientY) ** 2);
            // bust touch reaction
            if (bustLength < 50) {
                touching = true;
                player.mainTimelineLabel = '怒る01';
                player.diffTimelineSlot1 = 'びっくり2';
                player.diffTimelineSlot2 = 'いやいや';
                player.setVariable('arm_type', 2, 300);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = '平常';
                    player.diffTimelineSlot1 = '';
                    player.diffTimelineSlot2 = '';
                    player.setVariable('arm_type', 0, 300);
                }, 1500);
            }
            // eye touch reaction
            else if (eyeLength < 30) {
                touching = true;
                player.mainTimelineLabel = '困る00';
                player.diffTimelineSlot1 = 'ひく';
                player.setVariable('face_eye_open', 32);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = '平常';
                    player.diffTimelineSlot1 = '';
                    player.setVariable('face_eye_open', 0);
                }, 1000);
            }

        };
        // bind to mouse click event
        canvas.onclick = touch_reaction;
        // bind to mobile touch event
        canvas.addEventListener('touchstart', (ev) => {
            touch_reaction(ev.touches[0]);
            ev.preventDefault();
        }, false);
        canvas.addEventListener('touchend', (ev) => {
            ev.preventDefault();
        }, false);
   });
}

