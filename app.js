const container = document.getElementById('app-container');
const timeCountElement = document.getElementById('time-count');
const hitCountElement = document.getElementById('hit-count');
const winMessage = document.getElementById('win-message');

let hitCount = 0;
// 똥의 목표 완성 갯수를 10개에서 20개 사이로 게임마다 랜덤하게 설정합니다.
const targetCount = Math.floor(Math.random() * 11) + 10;
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

// 2. 터치 시 실행되는 함수
function createPoop(e) {
    e.preventDefault(); // 아이폰 제스처 오작동 방지
    
    if (isGameOver) return; 

    // 터치(Hit) 횟수 증가
    hitCount++;
    hitCountElement.innerText = hitCount;

    // [핵심] 괄호 누락 버그 방지를 위해 배열[] 대신 .item(0) 함수 사용
    let x = 0, y = 0;
    if (e.touches && e.touches.length > 0) {
        x = e.touches.item(0).clientX;
        y = e.touches.item(0).clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    // 터치한 위치에 뱀또아리 모양 똥(💩) 생성
    const poop = document.createElement('div');
    poop.innerText = '💩';
    poop.classList.add('poop');
    poop.style.left = `${x}px`;
    poop.style.top = `${y}px`;
    poop.style.fontSize = `${Math.random() * 40 + 60}px`; // 크기를 조금씩 다르게
    container.appendChild(poop);

    // 무작위 위치에 '똥'이라는 텍스트 글자 생성
    const text = document.createElement('div');
    text.innerText = '똥';
    text.classList.add('poop-text');
    // 글자가 화면 바깥으로 짤리지 않게 패딩 설정
    const textX = Math.random() * (window.innerWidth - 100) + 50;
    const textY = Math.random() * (window.innerHeight - 100) + 50;
    text.style.left = `${textX}px`;
    text.style.top = `${textY}px`;
    container.appendChild(text);

    // 글자가 위로 떠오르는 애니메이션(1.5초) 후 화면에서 지워짐
    text.addEventListener('animationend', () => text.remove());

    // 3. 승리 조건 체크 (터치 횟수가 랜덤으로 정해진 목표치에 도달했을 때)
    if (hitCount >= targetCount) {
        isGameOver = true;
        winMessage.style.display = 'block';
        
        winMessage.innerHTML = `
            <div style="margin-bottom: 20px;">Congratulation!</div>
            <button id="restart-btn">다시하기</button>
        `;
        
        // 다시하기 버튼 동작 연결
        const restartBtn = document.getElementById('restart-btn');
        const restartGame = (ev) => { ev.preventDefault(); location.reload(); };
        
        restartBtn.addEventListener('touchstart', restartGame, { passive: false });
        restartBtn.addEventListener('mousedown', restartGame);
    }
}

// 4. 화면 터치 이벤트 등록
container.addEventListener('touchstart', createPoop, { passive: false });
container.addEventListener('mousedown', createPoop);