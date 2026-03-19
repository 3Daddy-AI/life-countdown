// 日本の平均寿命（厚生労働省 2023年）
const LIFESPAN = {
  male: 81.05,
  female: 87.14
};

const setupScreen    = document.getElementById('setup-screen');
const countdownScreen = document.getElementById('countdown-screen');
const startBtn       = document.getElementById('start-btn');
const resetBtn       = document.getElementById('reset-btn');

let intervalId = null;
let dropAnimId = null;

startBtn.addEventListener('click', () => {
  const birthdate = document.getElementById('birthdate').value;
  const gender    = document.getElementById('gender').value;

  if (!birthdate) {
    alert('生年月日を入力してください');
    return;
  }

  setupScreen.classList.add('hidden');
  countdownScreen.classList.remove('hidden');

  startCountdown(new Date(birthdate), LIFESPAN[gender]);
  startSandDrop();
});

resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  cancelAnimationFrame(dropAnimId);
  countdownScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
});

function startCountdown(birthDate, lifespanYears) {
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + Math.floor(lifespanYears));
  // 小数点以下の月数も考慮
  const extraDays = Math.round((lifespanYears % 1) * 365);
  deathDate.setDate(deathDate.getDate() + extraDays);

  function update() {
    const now       = new Date();
    const totalMs   = deathDate - birthDate;
    const remainMs  = deathDate - now;

    if (remainMs <= 0) {
      document.getElementById('years').textContent   = '0';
      document.getElementById('days').textContent    = '0';
      document.getElementById('hours').textContent   = '0';
      document.getElementById('minutes').textContent = '0';
      document.getElementById('seconds').textContent = '0';
      document.getElementById('progress-text').textContent = '時間が来ました。';
      clearInterval(intervalId);
      return;
    }

    // 残り時間の計算
    const remainSec  = Math.floor(remainMs / 1000);
    const seconds    = remainSec % 60;
    const remainMin  = Math.floor(remainSec / 60);
    const minutes    = remainMin % 60;
    const remainHour = Math.floor(remainMin / 60);
    const hours      = remainHour % 24;
    const remainDay  = Math.floor(remainHour / 24);

    // 年と日を分離
    const years = Math.floor(remainDay / 365.25);
    const days  = Math.floor(remainDay % 365.25);

    document.getElementById('years').textContent   = years.toLocaleString();
    document.getElementById('days').textContent    = days.toLocaleString();
    document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // 進捗
    const elapsed  = now - birthDate;
    const progress = Math.min((elapsed / totalMs) * 100, 100);
    document.getElementById('progress-text').textContent =
      `人生の ${progress.toFixed(4)}% が経過しました`;

    // 砂時計の砂の量を更新
    updateSand(progress / 100);
  }

  update();
  intervalId = setInterval(update, 1000);
}

// 砂時計の砂の表示
function updateSand(progress) {
  const upperSand = document.getElementById('upper-sand');
  const lowerSand = document.getElementById('lower-sand');

  // 上部: 残り（progress=0で満杯、1で空）
  // 上部クリップ領域の高さは 78px（y=0〜78）
  const upperHeight = 78 * (1 - progress);
  upperSand.setAttribute('y', 78 - upperHeight);
  upperSand.setAttribute('height', upperHeight);

  // 下部: 経過（progress=0で空、1で満杯）
  // 下部クリップ領域の高さは 71px（y=82〜153）
  const lowerFill = 71 * progress;
  lowerSand.setAttribute('y', 153 - lowerFill);
  lowerSand.setAttribute('height', lowerFill);
}

// 砂粒アニメーション
function startSandDrop() {
  const drop = document.getElementById('sand-drop');
  let y = 78;
  let direction = 1;

  function animate() {
    y += 0.3 * direction;
    if (y > 87) { y = 78; }

    drop.setAttribute('cy', y);
    drop.setAttribute('opacity', y > 79 ? Math.max(0, 1 - (y - 79) / 8) : 0.8);

    dropAnimId = requestAnimationFrame(animate);
  }

  animate();
}
