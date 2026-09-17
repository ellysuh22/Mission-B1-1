// =========================================================
// 이 파일의 모든 기능은 같은 흐름으로 동작한다.
//   사용자 이벤트 → 상태(변수) 변경 → 화면(DOM) 업데이트
// =========================================================

// ---------------------------------------------------------
// 1. 다크 모드  (상태 → 렌더링 흐름 ①)
// ---------------------------------------------------------
const themeButton = document.querySelector('#theme-toggle');

// [상태] 저장된 테마가 있으면 그 값, 없으면 'light'
let theme = localStorage.getItem('theme') || 'light';

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
// ---------------------------------------------------------
const menuButton = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

menuButton.addEventListener('click', () => {
  // active 클래스가 없으면 붙이고, 있으면 뗀다
  navMenu.classList.toggle('active');
});


// ---------------------------------------------------------
// 3. 부드러운 스크롤
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
// ---------------------------------------------------------
const GITHUB_USERNAME = 'ellysuh22'; // 본인 GitHub 아이디
const projectStatus = document.querySelector('#project-status');
const projectList = document.querySelector('#project-list');

// [상태] 'loading' | 'success' | 'error' | 'empty' 중 하나
let projectState = 'loading';
let projects = [];

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

// [렌더링] 상태(projectState)를 보고 Projects 영역을 그린다
const renderProjects = () => {
  // 먼저 이전 화면을 비운다
  projectStatus.innerHTML = '';
  projectList.innerHTML = '';

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
    // map: 저장소 배열 → 카드 HTML 배열, join(''): 하나의 문자열로 합치기
    projectList.innerHTML = projects.map(createProjectCard).join('');
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
// ---------------------------------------------------------
const contactForm = document.querySelector('#contact-form');
const formInputs = document.querySelectorAll('.form-input'); // 이름, 이메일, 메시지
const successMessage = document.querySelector('#success-message');

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

// [이벤트] 제출 버튼 → 모든 칸 검사 → 결과 표시
contactForm.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지 새로고침(기본 제출)을 막는다

  formInputs.forEach((input) => {
    errors[input.id] = getErrorMessage(input);
    renderError(input);
  });

  const isValid = errors.name === '' && errors.email === '' && errors.message === '';

  if (isValid) {
    successMessage.textContent = '✅ 메시지가 전송되었습니다. 감사합니다!';
    contactForm.reset(); // 입력칸 비우기
  } else {
    successMessage.textContent = '';
  }
});
