# Youngsuk Suh 포트폴리오 웹사이트

외부 라이브러리 없이 **순수 HTML / CSS / JavaScript** 로 만든 반응형 포트폴리오 웹사이트입니다.
"사용자 이벤트 → 상태 변경 → 화면 업데이트" 흐름을 직접 구현하는 것을 목표로 했습니다.

## 배포 URL

👉 https://ellysuh22.github.io/Mission-B1-1/

## 스크린샷

| 데스크톱 | 모바일 | 다크 모드 |
| --- | --- | --- |
| ![데스크톱 화면](images/screenshots/desktop.png) | ![모바일 화면](images/screenshots/mobile.png) | ![다크 모드 화면](images/screenshots/dark.png) |

## 사용 기술

- **HTML5**: 시맨틱 태그 (`header`, `nav`, `main`, `section`, `article`, `footer`)
- **CSS3**: CSS 변수, Flexbox, Grid, 미디어 쿼리 (모바일 퍼스트)
- **JavaScript (ES6+)**: DOM 조작, 이벤트, `fetch` + `async/await`, Intersection Observer, localStorage
- **GitHub API**: `https://api.github.com/users/ellysuh22/repos`
- **Google Fonts**: Noto Sans KR
- **배포**: GitHub Pages

## 폴더 구조

```
B-1/
├── index.html          # 메인 페이지 (화면 구조)
├── css/
│   └── style.css       # 모든 스타일 (색상, 레이아웃, 반응형)
├── js/
│   └── main.js         # 모든 동작 (이벤트, API, 폼 검사)
└── images/
    ├── profile.jpg     # 프로필 사진
    └── screenshots/    # README 스크린샷
```

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 반응형 레이아웃 | 모바일 기본 → 768px(태블릿) → 1024px(데스크톱) |
| 햄버거 메뉴 | 768px 미만에서 ☰ 버튼 클릭 시 메뉴 열기/닫기 |
| 부드러운 스크롤 | 메뉴·버튼 클릭 시 해당 섹션으로 부드럽게 이동 |
| 네비게이션 배경 변경 | 스크롤 **60px** 이상이면 배경색 + 그림자 표시 |
| 맨 위로 버튼 | 스크롤 **300px** 이상이면 버튼 표시, 클릭 시 맨 위로 이동 |
| 스크롤 애니메이션 | Intersection Observer, threshold **0.2** (20% 보이면 나타남) |
| 다크 모드 | 🌙/☀️ 버튼으로 전환, localStorage에 저장되어 새로고침 후에도 유지 |
| GitHub 프로젝트 | API로 저장소 목록을 가져와 카드로 표시 (포크 저장소는 제외) |
| 문의 폼 검사 | 빈칸 검사, 이메일 형식 검사, 입력칸 아래 에러 메시지, 성공 메시지 |

## 상태 → 렌더링 흐름

| # | 이벤트 | 상태 (변수) | 화면 업데이트 |
| --- | --- | --- | --- |
| ① | 다크 모드 버튼 클릭 | `theme` : `'light'` ↔ `'dark'` | `renderTheme()` → `<html data-theme>` 변경 → 전체 색상 변경 |
| ② | 페이지 열림 / 다시 시도 클릭 | `projectState` : `loading` → `success` / `error` / `empty` | `renderProjects()` → 스피너 / 카드 / 에러 메시지 / 빈 메시지 |
| ③ | 폼 입력(input) / 제출(submit) | `errors` : `{ name, email, message }` | `renderError()` → 에러 메시지 표시·숨김 + 빨간 테두리 |

## 실행 방법

1. VS Code에서 폴더 열기
2. Live Server 확장 설치
3. `index.html` 우클릭 → **Open with Live Server**

> GitHub API는 로그인 없이 **1시간에 60번**까지만 호출할 수 있습니다.
> 너무 자주 새로고침하면 403 에러가 나고, 이때는 "프로젝트를 불러올 수 없습니다" 화면이 표시됩니다.

## 배포 방법 (GitHub Pages)

1. GitHub에 새 저장소를 만들고 이 폴더의 파일을 올린다.
2. 저장소 **Settings → Pages** 로 이동한다.
3. Source: **Deploy from a branch**, Branch: **main** / **(root)** 선택 후 Save.
4. 1~2분 뒤 `https://ellysuh22.github.io/저장소이름/` 으로 접속한다.
