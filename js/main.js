// =========================================================
// main.js · 화면의 동작 (누르면 무슨 일이 생기는지)
// 📌 미션 요구 : const/let만 사용 · addEventListener로 이벤트 연결 · DOM 조작 ·
//               인터랙션 6가지 · GitHub API(로딩/성공/에러/빈 상태) · 폼 유효성 검사
// 🎯 과제 목표 : Q3 DOM과 이벤트 · Q4 ES6+ 문법 · Q5 비동기 · Q6 상태 → 렌더링
// 📝 평가 문항 : 1-2 · 1-3 · 1-4 · 1-5 · 2-4 · 3-1 · 3-2 · 3-3
// 📖 설명 문서 : README.md(요구사항 ↔ 구현 위치) · Pass.md(5분 답변)
//
// 이 파일의 7개 구역
//   1 다크 모드   2 햄버거 메뉴   3 부드러운 스크롤   4 스크롤 이벤트
//   5 스크롤 애니메이션   6 GitHub API   7 문의 폼 검사
// =========================================================
// =========================================================
// 이 파일의 모든 기능은 같은 흐름으로 동작한다.
//   사용자 이벤트 → 상태(변수) 변경 → 화면(DOM) 업데이트
// =========================================================

// ---------------------------------------------------------
// 1. 다크 모드  (상태 → 렌더링 흐름 ①)
// 📌 요구 : 다크 모드 전환 + localStorage 저장으로 새로고침 후에도 유지
// 🎯 Q6  |  📝 평가 1-2 · 3-1
// ---------------------------------------------------------
const themeButton = document.querySelector('#theme-toggle');

// [상태] 저장된 테마가 있으면 그 값, 없으면 'light'
// [보너스] 시스템 다크 모드 감지: 컴퓨터 설정이 다크 모드면 true
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// [상태] 저장된 테마가 있으면 그 값
let theme = localStorage.getItem('theme');

// 저장된 값이 없으면(첫 방문) 컴퓨터 설정을 따라간다
if (theme === null) {
  if (systemPrefersDark) {
    theme = 'dark';
  } else {
    theme = 'light';
  }
}

// [렌더링] 상태(theme)를 보고 화면을 바꾼다
const renderTheme = () => {
  // <html data-theme="dark"> → CSS의 [data-theme="dark"] 변수가 적용됨
  document.documentElement.setAttribute('data-theme', theme);

  if (theme === 'dark') {
    themeButton.textContent = '☀️';
  } else {
    themeButton.textContent = '🌙';
  }
};

// [이벤트] 버튼 클릭 → 상태 변경 → 저장 → 렌더링
themeButton.addEventListener('click', () => {
  if (theme === 'light') {
    theme = 'dark';
  } else {
    theme = 'light';
  }
  localStorage.setItem('theme', theme); // 새로고침해도 유지되도록 저장
  renderTheme();
});

renderTheme(); // 페이지가 처음 열릴 때 한 번 실행


// ---------------------------------------------------------
// 2. 햄버거 메뉴 토글
// 📌 요구 : 모바일에서 ☰ 클릭 시 메뉴 열기/닫기 (classList.toggle)
// 🎯 Q3  |  📝 평가 1-3 · 2-4
// ---------------------------------------------------------
const menuButton = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

menuButton.addEventListener('click', () => {
  // active 클래스가 없으면 붙이고, 있으면 뗀다
  navMenu.classList.toggle('active');
});


// ---------------------------------------------------------
// 3. 부드러운 스크롤
// 📌 요구 : 메뉴 클릭 시 해당 섹션으로 부드럽게 이동 (기본 동작은 preventDefault로 막음)
// 🎯 Q3  |  📝 평가 1-3
// ---------------------------------------------------------
// href가 '#'으로 시작하는 모든 링크 (메뉴, 로고, Hero 버튼)
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 동작(순간 이동)을 막는다

    const targetId = link.getAttribute('href'); // 예: '#about'
    const targetSection = document.querySelector(targetId);

    targetSection.scrollIntoView({ behavior: 'smooth' });
    navMenu.classList.remove('active'); // 모바일 메뉴는 이동 후 닫기
  });
});


// ---------------------------------------------------------
// 4. 스크롤 이벤트: 네비게이션 배경 변경 + 맨 위로 버튼
// 📌 요구 : 스크롤 60px에서 네비 배경 변경 / 300px에서 맨 위로 버튼 (기준값은 README에 명시)
// 📝 평가 1-3
// ---------------------------------------------------------
const header = document.querySelector('#header');
const topButton = document.querySelector('#top-button');

const HEADER_CHANGE_POINT = 60; // 60px 넘으면 네비게이션 배경색 변경
const TOP_BUTTON_POINT = 300;   // 300px 넘으면 맨 위로 버튼 표시

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY; // 현재 스크롤 위치(px)

  if (scrollY > HEADER_CHANGE_POINT) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (scrollY > TOP_BUTTON_POINT) {
    topButton.classList.add('show');
  } else {
    topButton.classList.remove('show');
  }
});

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ---------------------------------------------------------
// 5. 스크롤 애니메이션 (Intersection Observer)
// 📌 요구 : 스크롤 애니메이션 threshold 0.2 (기준값은 README에 명시)
// 📝 평가 1-3
// ---------------------------------------------------------
const fadeElements = document.querySelectorAll('.fade-in');

// 요소가 화면에 20%(0.2) 이상 보이면 .show 클래스를 붙인다
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // 한 번 나타났으면 더 볼 필요 없음
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach((element) => {
  observer.observe(element);
});


// ---------------------------------------------------------
// 6. GitHub API 프로젝트  (상태 → 렌더링 흐름 ②)
// 📌 요구 : fetch + async/await · 로딩/성공/에러/빈 상태 UI · try-catch(403 포함) · map/filter
// 🎯 Q4 · Q5  |  📝 평가 1-4 · 3-2 · 3-3
// ---------------------------------------------------------
const GITHUB_USERNAME = 'ellysuh22'; // 본인 GitHub 아이디
const projectStatus = document.querySelector('#project-status');
const projectList = document.querySelector('#project-list');
const projectFilters = document.querySelector('#project-filters'); // [보너스] 언어 버튼 자리

// [상태] 'loading' | 'success' | 'error' | 'empty' 중 하나
let projectState = 'loading';
let projects = [];

// [상태] 지금 고른 언어 ('all' = 전체) — [보너스] 언어별 필터
let currentLanguage = 'all';

// 저장소 객체 1개 → 카드 HTML 문자열 1개
const createProjectCard = (repo) => {
  // 구조분해 할당: repo 객체에서 필요한 값만 꺼낸다
  const { name, description, html_url, stargazers_count, language } = repo;

  // 템플릿 리터럴(백틱 ``)로 HTML 만들기, ${ } 안에 변수 넣기
  return `
    <article class="project-card">
      <h3>${name}</h3>
      <p class="project-description">${description || '설명이 없습니다.'}</p>
      <p class="project-info">⭐ ${stargazers_count} · ${language || '기타'}</p>
      <a href="${html_url}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub에서 보기 →</a>
    </article>
  `;
};

// [보너스] 언어 버튼 1개의 HTML 만들기
const createFilterButton = (language, label) => {
  // 지금 고른 언어면 active 클래스를 붙여서 색을 다르게 보여준다
  let activeClass = '';
  if (currentLanguage === language) {
    activeClass = ' active';
  }
  return `<button type="button" class="filter-btn${activeClass}" data-language="${language}">${label}</button>`;
};

// [보너스] 언어 버튼들을 만들고, 버튼마다 클릭 이벤트를 연결한다
const renderFilters = () => {
  // 저장소들의 언어를 중복 없이 모은다
  const languages = [];
  projects.forEach((repo) => {
    const language = repo.language || '기타';
    if (languages.includes(language) === false) {
      languages.push(language);
    }
  });

  // '전체' 버튼 + 언어별 버튼
  projectFilters.innerHTML =
    createFilterButton('all', '전체') +
    languages.map((language) => createFilterButton(language, language)).join('');

  // 버튼이 방금 만들어졌으니 지금 이벤트를 연결한다
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      currentLanguage = button.getAttribute('data-language'); // 상태 변경
      renderProjects();                                       // 화면 다시 그리기
    });
  });
};

// [렌더링] 상태(projectState)를 보고 Projects 영역을 그린다
const renderProjects = () => {
  // 먼저 이전 화면을 비운다
  projectStatus.innerHTML = '';
  projectList.innerHTML = '';
  projectFilters.innerHTML = ''; // [보너스] 언어 버튼도 비우기

  if (projectState === 'loading') {
    projectStatus.innerHTML = `
      <div class="spinner"></div>
      <p class="status-text">로딩 중...</p>
    `;
  } else if (projectState === 'error') {
    projectStatus.innerHTML = `
      <p class="status-text">프로젝트를 불러올 수 없습니다.</p>
      <button type="button" class="btn" id="retry-button">다시 시도</button>
    `;
    // 버튼이 방금 새로 만들어졌으니, 지금 이벤트를 연결한다
    const retryButton = document.querySelector('#retry-button');
    retryButton.addEventListener('click', loadProjects);
  } else if (projectState === 'empty') {
    projectStatus.innerHTML = `<p class="status-text">표시할 프로젝트가 없습니다.</p>`;
  } else if (projectState === 'success') {
    renderFilters(); // [보너스] 언어 버튼 먼저 그리기

    // [보너스] filter: 고른 언어의 저장소만 남긴다 ('all'이면 전부 보여줌)
    const visibleProjects = projects.filter((repo) => {
      if (currentLanguage === 'all') {
        return true;
      }
      return (repo.language || '기타') === currentLanguage;
    });

    // map: 저장소 배열 → 카드 HTML 배열, join(''): 하나의 문자열로 합치기
    projectList.innerHTML = visibleProjects.map(createProjectCard).join('');
  }
};

// [이벤트] API 호출 → 상태 변경 → 렌더링
const loadProjects = async () => {
  projectState = 'loading';
  renderProjects();

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

    // 403(요청 횟수 초과), 404(없는 아이디) 등은 에러로 처리
    if (!response.ok) {
      throw new Error(`요청 실패: ${response.status}`);
    }

    const data = await response.json();

    // filter: 포크(남의 저장소를 복사한 것)는 빼고 내 저장소만 남긴다
    projects = data.filter((repo) => repo.fork === false);

    if (projects.length === 0) {
      projectState = 'empty';
    } else {
      projectState = 'success';
    }
  } catch (error) {
    console.error(error);
    projectState = 'error';
  }

  renderProjects();
};

loadProjects(); // 페이지가 열리면 바로 불러오기


// ---------------------------------------------------------
// 7. 문의 폼 유효성 검사  (상태 → 렌더링 흐름 ③)
// 📌 요구 : 필수값 · 이메일 형식 검사 · 입력칸 근처 에러 메시지 · preventDefault + 성공 메시지
// 🎯 Q6  |  📝 평가 1-5
// ---------------------------------------------------------
const contactForm = document.querySelector('#contact-form');
const formInputs = document.querySelectorAll('.form-input'); // 이름, 이메일, 메시지
const successMessage = document.querySelector('#success-message');

// [보너스] 실제 메일 전송 (Formspree)
//   ① https://formspree.io 에서 무료 가입 → New Form 만들기
//   ② 받은 주소(https://formspree.io/f/xxxxxxxx)를 아래 따옴표 안에 붙여넣기
//   ③ 비워 두면 지금처럼 화면에만 성공 메시지가 뜬다 (메일은 가지 않음)
const FORMSPREE_URL = '';

// 이메일 형식: (글자)@(글자).(글자)  예: abc@naver.com
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// [상태] 입력칸별 에러 메시지 ('' 이면 에러 없음)
const errors = {
  name: '',
  email: '',
  message: '',
};

// 입력칸 하나를 검사해서 에러 메시지를 돌려준다
const getErrorMessage = (input) => {
  const value = input.value.trim(); // 앞뒤 공백 제거

  if (value === '') {
    return '필수 입력 항목입니다.';
  }
  if (input.id === 'email' && !EMAIL_PATTERN.test(value)) {
    return '올바른 이메일 형식이 아닙니다.';
  }
  return '';
};

// [렌더링] 상태(errors)를 보고 에러 메시지를 보여주거나 숨긴다
const renderError = (input) => {
  // input.id 가 'email' 이면 errors['email'] = errors.email
  const message = errors[input.id];
  const errorElement = document.querySelector(`#${input.id}-error`);

  errorElement.textContent = message;

  if (message === '') {
    input.classList.remove('invalid');
  } else {
    input.classList.add('invalid');
  }
};

// [이벤트] 글자를 입력할 때마다 → 상태 변경 → 렌더링
formInputs.forEach((input) => {
  input.addEventListener('input', () => {
    errors[input.id] = getErrorMessage(input);
    renderError(input);
  });
});

// [보너스] 입력한 내용을 Formspree로 보내기
const sendToFormspree = async () => {
  successMessage.textContent = '보내는 중...';

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',                                   // 데이터를 '보내는' 방식
      headers: { 'Content-Type': 'application/json' },  // JSON으로 보낸다고 알려주기
      body: JSON.stringify({                            // 보낼 내용을 JSON 글자로 변환
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        message: document.querySelector('#message').value,
      }),
    });

    if (!response.ok) {
      throw new Error(`전송 실패: ${response.status}`);
    }

    successMessage.textContent = '✅ 메시지가 전송되었습니다. 감사합니다!';
    contactForm.reset();
  } catch (error) {
    console.error(error);
    successMessage.textContent = '⚠️ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }
};

// [이벤트] 제출 버튼 → 모든 칸 검사 → 결과 표시
contactForm.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지 새로고침(기본 제출)을 막는다

  formInputs.forEach((input) => {
    errors[input.id] = getErrorMessage(input);
    renderError(input);
  });

  const isValid = errors.name === '' && errors.email === '' && errors.message === '';

  if (isValid) {
    if (FORMSPREE_URL === '') {
      // Formspree 주소를 아직 넣지 않았으면 화면에만 성공 메시지 (검사 연습용)
      successMessage.textContent = '✅ 메시지가 전송되었습니다. 감사합니다!';
      contactForm.reset(); // 입력칸 비우기
    } else {
      sendToFormspree(); // [보너스] 실제 메일 보내기
    }
  } else {
    successMessage.textContent = '';
  }
});



// ---------------------------------------------------------
// 8. Hero 타이핑 효과 (보너스)
// 📌 보너스 : 문구 여러 개를 썼다가 지웠다가 반복해서 보여주기
// 📝 평가 : 부록 D 보너스 과제
// ---------------------------------------------------------
const typingText = document.querySelector('#typing-text');

// 돌아가며 보여줄 문구들 (여기만 고치면 문구가 바뀐다)
const TYPING_TEXTS = [
  'AI 시대를 준비하는 예비 창업자',
  '지금은 HTML · CSS · JavaScript를 배우는 중',
];

const TYPING_SPEED = 90;    // 한 글자 쓰는 속도 (0.09초)
const DELETING_SPEED = 40;  // 한 글자 지우는 속도 (지울 때는 더 빠르게)
const HOLD_TIME = 1500;     // 다 쓰고 잠시 멈춰 있는 시간 (1.5초)

// [상태] 지금 몇 번째 문구를, 몇 글자까지, 쓰는 중인지 지우는 중인지
let textIndex = 0;
let charCount = 0;
let isDeleting = false;

const typeLoop = () => {
  const fullText = TYPING_TEXTS[textIndex]; // 지금 보여줄 문구 하나

  // 지우는 중이면 한 글자 줄이고, 아니면 한 글자 늘린다
  if (isDeleting) {
    charCount = charCount - 1;
  } else {
    charCount = charCount + 1;
  }

  typingText.textContent = fullText.slice(0, charCount); // 앞에서 n글자만 보여주기

  // 다음 글자까지 기다릴 시간
  let delay = TYPING_SPEED;
  if (isDeleting) {
    delay = DELETING_SPEED;
  }

  if (isDeleting === false && charCount === fullText.length) {
    // 다 썼으면 → 잠시 멈췄다가 지우기 시작
    isDeleting = true;
    delay = HOLD_TIME;
  } else if (isDeleting === true && charCount === 0) {
    // 다 지웠으면 → 다음 문구로 넘어간다
    isDeleting = false;
    textIndex = textIndex + 1;
    if (textIndex === TYPING_TEXTS.length) {
      textIndex = 0; // 마지막 문구까지 끝났으면 처음으로 돌아간다
    }
    delay = 400;
  }

  setTimeout(typeLoop, delay); // 정해진 시간 뒤에 이 함수를 다시 실행 (반복)
};

typingText.textContent = ''; // HTML에 적힌 문장을 지우고
typeLoop();                  // 타이핑 시작
