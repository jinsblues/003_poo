const container = document.getElementById('app-container');
const timeCountElement = document.getElementById('time-count');
const hitCountElement = document.getElementById('hit-count');
const winMessage = document.getElementById('win-message');

let hitCount = 0;
// [수정됨] 똥의 목표 완성 갯수를 30개에서 150개 사이로 게임마다 랜덤하게 설정합니다.
const targetCount = Math.floor(Math.random() * 121) + 30;
let startTime = Date.now();
let isGameOver = false;
let timerFrame;

// 1. 밀리초 단위 스톱워치 (00:00:00 포맷)
function updateTime() {
    if (isGameOver) return; // 게임이 끝나면 타이머 즉시 정지

    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); 

    const formattedMin = String(minutes).padStart(2, '0');
    const formattedSec = String(seconds).padStart(2, '0');
    const formattedMs = String(milliseconds).padStart(2, '0');

    timeCountElement.innerText = `${formattedMin}:${formattedSec}:${formattedMs}`;
    timerFrame = requestAnimationFrame(updateTime); 
}
updateTime();

// 2. 방구(뿌직) 소리 생성기 (사파리 정책 호환 Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playFartSound() {
    // 사파리 오디오 정책: 터치 시점에 잠금 해제
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // 톱니파(sawtooth)를 이용해 거칠고 떨리는 방구 소리와 유사한 파동 생성
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2); 

    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

// 3. 터치 시 실행되는 함수
function createPoop(e) {
    e.preventDefault(); // 아이폰 제스처 오작동 방지
    
    if (isGameOver) return; 

    // 방구 소리 재생
    playFartSound();

    // 터치(Hit) 횟수 증가
    hitCount++;
    hitCountElement.innerText = hitCount;

    // 괄호 누락 버그 방지를 위해 .item(0) 함수 사용
    let x = 0, y = 0;
    if (e.touches && e.touches.length > 0) {
        x = e.touches.item(0).clientX;
        y = e.touches.item(0).clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    // 터치한 위치에 똥(💩) 생성
    const poop = document.createElement('div');
    poop.innerText = '💩';
    poop.classList.add('poop');
    poop.style.left = `${x}px`;
    poop.style.top = `${y}px`;
    poop.style.fontSize = `${Math.random() * 40 + 60}px`; 
    container.appendChild(poop);

    // 무작위 위치에 '똥'이라는 텍스트 글자 생성
    const text = document.createElement('div');
    text.innerText = '똥';
    text.classList.add('poop-text');
    const textX = Math.random() * (window.innerWidth - 100) + 50;
    const textY = Math.random() * (window.innerHeight - 100) + 50;
    text.style.left = `${textX}px`;
    text.style.top = `${textY}px`;
    container.appendChild(text);

    // 글자가 위로 떠오르는 애니메이션(1.5초) 후 화면에서 지워짐
    text.addEventListener('animationend', () => text.remove());

    // 4. 승리 조건 체크 (목표치 도달 시 왕똥과 성공 메시지 출력)
    if (hitCount >= targetCount) {
        isGameOver = true;
        winMessage.style.display = 'block';
        
        // HTML을 변경하여 커다란 왕똥 이미지와 새로운 메시지 삽입
        winMessage.innerHTML = `
            <div style="font-size: 100px; margin-bottom: 10px; animation: pop 0.5s ease-out;">💩</div>
            <div style="margin-bottom: 20px;">와!! 똥을 다쌌다!!</div>
            <button id="restart-btn">다시하기</button>
        `;
        
        // 다시하기 버튼 동작 연결
        const restartBtn = document.getElementById('restart-btn');
        const restartGame = (ev) => { ev.preventDefault(); location.reload(); };
        
        restartBtn.addEventListener('touchstart', restartGame, { passive: false });
        restartBtn.addEventListener('mousedown', restartGame);
    }
}

// 5. 화면 터치 이벤트 등록
container.addEventListener('touchstart', createPoop, { passive: false });
container.addEventListener('mousedown', createPoop);