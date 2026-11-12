import { ic, kbd, type Block, type Doc } from "#lib/docs/shared";

const status: Block = { t: "callout", label: "상태", tone: "danger", html: "ene는 아직 출시 전이에요. 설치 방법은 첫 릴리스 때 여기에 올릴게요." };

export const docs: Doc[] = [
  { slug: "introduction", group: "시작하기", title: "소개",
    lede: "아키텍처 다이어그램은 무엇이 무엇과 연결됐는지 보여 줘요. ene는 실제로 무슨 일이 벌어지는지 보여 줘요. 어떤 요청이 먼저 가는지, 어디서 기다리고 어디서 실패하는지, 캐시 미스 때 어느 길로 가는지까지요.",
    sections: [
      { id: "how", h: "동작 방식", blocks: [{ t: "p", html: "단계를 한 줄에 하나씩 텍스트로 적으세요. ene가 읽어서 노드를 배치하고 단계를 차례로 재생해요. 점이 화살표를 하나씩 따라가요." },
        { t: "player", label: "주문 요청", code: "title Order request\nuser[User] -> api[API Server] : POST /order\napi -> cache[Redis] : check stock\ncache --> api : miss\napi -> db[MySQL] : SELECT stock & api -> pay[Payment] : charge\ndb --> api : in stock\npay -x api : timeout\napi --> user : 502 retry later" }] },
      { id: "ways", h: "쓰는 방법 두 가지", blocks: [{ t: "cards", items: [
        { href: "/docs/web-page", title: "웹 페이지에서", code: '<pre class="ene">', text: "재생, 일시정지, 단계 이동, 속도 조절까지 되는 라이브 플레이어." },
        { href: "/docs/image", title: "이미지로", code: "ene flow.ene -o flow.svg", text: "README와 문서에 바로 넣는, 혼자 재생되는 SVG." }] }] },
      { id: "status", h: "상태", blocks: [status] }
    ] },
  { slug: "web-page", group: "시작하기", title: "웹 페이지에서",
    lede: `다이어그램을 ${ic("&lt;pre class=\"ene\"&gt;")} 안에 넣고 스크립트 하나만 불러오세요. 블록이 전부 플레이어로 바뀌어요.`,
    sections: [
      { id: "script", h: "스크립트 추가", blocks: [{ t: "code", file: "index.html", code: '<pre class="ene">\nuser -> api : GET /\napi --> user : 200\n</pre>\n\n<script src="ene.js"></script>' },
        { t: "p", html: "스크립트가 로드되면 이 클래스가 붙은 블록을 모두 찾아 파싱하고 배치한 다음 플레이어로 바꿔요. 텍스트는 HTML에 그대로 남으니 JavaScript가 꺼져 있어도 읽을 수 있어요." }] },
      { id: "result", h: "결과", blocks: [{ t: "player", label: "최소 예제", code: "user -> api : GET /\napi --> user : 200" }] },
      { id: "keyboard", h: "키보드", blocks: [{ t: "p", html: `플레이어를 클릭한 다음 ${kbd("Space")}로 재생·일시정지하고 ${kbd("←")}와 ${kbd("→")}로 이전·다음 단계로 넘어가세요.` }] }
    ] },
  { slug: "image", group: "시작하기", title: "이미지로",
    lede: "다이어그램을 혼자 재생되는 SVG로 뽑아요. 이미지가 들어가는 곳이면 어디든 넣을 수 있어요.",
    sections: [
      { id: "render", h: "렌더링", blocks: [{ t: "code", file: "terminal", code: "$ ene flow.ene -o flow.svg" }, { t: "p", html: "SVG는 알아서 반복 재생돼요. 스크립트가 필요 없고, 보는 사람의 다크 모드와 동작 줄이기 설정도 따라가요." }] },
      { id: "embed", h: "삽입", blocks: [{ t: "code", file: "README.md", code: "## How checkout works\n\n![Order request](flow.svg)" }] },
      { id: "untrusted", h: "남이 쓴 파일 렌더링하기", blocks: [{ t: "p", html: `직접 쓰지 않은 파일을 서버에서 렌더링한다면 ${ic("--no-network")}로 원격 아이콘을 끄거나 ${ic("--allow-host &lt;host&gt;")}로 허용한 호스트에서만 가져오게 하세요. 둘을 같이 써도 돼요.` },
        { t: "code", file: "terminal", code: "$ ene flow.ene -o flow.svg --no-network\n$ ene flow.ene -o flow.svg --allow-host icons.example.com" },
        { t: "callout", label: "참고", html: "아이콘을 못 불러와도 렌더링은 멈추지 않아요. 그 노드만 아이콘 없이 그려지고, 이유는 stderr에 찍혀요." }] }
    ] },
  { slug: "syntax", group: "작성법", title: "문법",
    lede: "한 줄이 한 단계고, 위에서 아래로 재생돼요. 나머지는 다 선택이에요.",
    sections: [
      { id: "reference", h: "레퍼런스", blocks: [{ t: "table", head: ["문법", "의미", "화면에서는"], mono: [0], rows: [
        ["a -> b : label", "요청", "점이 a에서 b로 가요."], ["a --> b : label", "응답", "점선으로 그려요. 보통 돌아오는 방향이에요."],
        ["a -x b : label", "실패", "점이 중간에 멈추고 빨갛게 바뀌어요."], ["a -> b & a -> c", "동시에", "두 선이 한 단계에서 같이 재생돼요."],
        ["a -> b : label @2s", "소요 시간", "이 선은 2초 동안 재생돼요."], ["wait 0.5", "대기", "다음 단계로 가기 전에 적은 초만큼 기다려요."],
        ["branch … / else … / end", "대안 경로", "보는 사람이 플레이어에서 고르는 경로예요."], ["loop 3 … end", "반복", "안쪽 단계를 세 번 재생해요."],
        ["group vpc[VPC] : a b", "컨테이너", "적은 노드를 상자 하나로 묶어요."], ["id[Label]{icon: …, shape: db, color: #f59e0b}", "노드 스타일", "노드 레이블, 아이콘, 모양, 색상."],
        ["diagram sequence", "레이아웃", "흐름을 시퀀스 다이어그램으로 그려요."]] }] },
      { id: "try", h: "직접 해 보기", blocks: [{ t: "player", label: "결제 재시도", code: "title Payment retry\norder[Order Service] -> pg[Payment Gateway] : authorize\npg -x order : timeout\nwait 1\norder -> pg : authorize (retry 1)\npg -x order : 503\nwait 2\norder -> pg : authorize (retry 2)\npg --> order : approved\norder -> ledger[Ledger] : record payment" }] }
    ] },
  { slug: "branches", group: "작성법", title: "분기",
    lede: "한 단계에서 나올 수 있는 두 결과를 다 적어 두세요. 어느 쪽을 재생할지는 보는 사람이 골라요.",
    sections: [
      { id: "write", h: "분기 쓰기", blocks: [{ t: "code", file: "cache.ene", code: "client[Client] -> api[API] : GET /product/42\napi -> redis[Redis] : GET product:42\nbranch cache hit\n  redis --> api : product\nelse cache miss\n  redis --> api : nil\n  api -> db[MySQL] : SELECT\n  db --> api : product\n  api -> redis : SET product:42\nend\napi --> client : 200" }] },
      { id: "player", h: "플레이어에서", blocks: [{ t: "p", html: "분기는 플레이어에 선택지로 떠요. 경로를 고르면 분기 지점부터 다시 재생해요. end 뒤의 단계는 어느 경로를 골라도 재생돼요." },
        { t: "player", label: "캐시 히트 또는 미스", code: "title Cache hit / miss\nclient[Client] -> api[API] : GET /product/42\napi -> redis[Redis] : GET product:42\nbranch cache hit\n  redis --> api : product\nelse cache miss\n  redis --> api : nil\n  api -> db[MySQL] : SELECT\n  db --> api : product\n  api -> redis : SET product:42\nend\napi --> client : 200" }] },
      { id: "rules", h: "규칙", blocks: [{ t: "list", items: [`${ic("branch")}로 첫 경로를 열어요. 뒤에 쓴 텍스트가 선택지 이름이 돼요.`, `${ic("else")}를 하나 쓸 때마다 선택지가 하나씩 늘어요.`, `${ic("end")}로 블록을 닫아요. 들여쓰기는 해도 되고 안 해도 돼요.`] }] }
    ] },
  { slug: "waits-and-loops", group: "작성법", title: "대기와 반복",
    lede: "타이밍을 조절해 보세요. 단계 사이에 쉬거나, 선 하나만 느리게 하거나, 단계를 동시에 돌리거나 반복할 수 있어요.",
    sections: [
      { id: "wait", h: "대기", blocks: [{ t: "code", code: "pg -x order : timeout\nwait 1\norder -> pg : authorize (retry 1)" }, { t: "p", html: `${ic("wait 1")}을 쓰면 다음 단계 전에 1초 쉬어요. 소수도 돼요. 예: ${ic("wait 0.5")}.` }] },
      { id: "duration", h: "선마다 걸리는 시간", blocks: [{ t: "code", code: "api -> db : full scan @2s" }, { t: "p", html: `단계 끝에 ${ic("@2s")}를 붙이면 그 선만 2초 동안 재생돼요.` }] },
      { id: "parallel", h: "동시에 돌리기", blocks: [{ t: "code", code: "api -> db : SELECT stock & api -> pay : charge" }, { t: "p", html: `단계를 ${ic("&amp;")}로 이으면 한 단계에서 동시에 재생돼요.` }] },
      { id: "loop", h: "반복", blocks: [{ t: "code", code: "loop 3\n  worker -> queue : poll\n  queue --> worker : empty\nend" }, { t: "p", html: `${ic("loop 3")}을 쓰면 안쪽 단계를 세 번 반복해요.` }] }
    ] },
  { slug: "groups-and-styles", group: "작성법", title: "그룹과 스타일",
    lede: "노드에 이름을 붙이고, 아이콘과 모양을 정하고, 관련 있는 노드끼리 상자로 묶어 보세요.",
    sections: [
      { id: "style", h: "노드 레이블과 스타일", blocks: [{ t: "code", code: "api[Order API]{icon: logos:aws-ec2} -> db[Orders DB]{shape: db, color: #f59e0b} : INSERT" },
        { t: "table", head: ["키", "값"], mono: [0], rows: [["icon", "logos:redis 같은 팩 이름 또는 SVG 주소"], ["shape", "circle, db, queue"], ["color", "#f59e0b 같은 16진수 색상"]] }] },
      { id: "groups", h: "그룹", blocks: [{ t: "p", html: `${ic("group")}은 적은 노드를 상자 하나로 묶어요. ${ic("in vpc")}를 붙이면 그룹을 다른 그룹 안에 넣어요.` },
        { t: "player", label: "VPC 안의 주문 서비스", code: "title Order service in a VPC\nuser[User]{icon: logos:chrome, shape: circle} -> alb[ALB]{icon: logos:aws-elb} : HTTPS\nalb -> api[Order API]{icon: logos:aws-ec2} : /orders\napi -> db[Orders DB]{icon: logos:aws-rds, shape: db} : INSERT\ndb --> api : OK\napi --> user : 201\ngroup vpc[VPC 10.0.0.0/16] : alb api db\ngroup priv[Private subnet] in vpc : api db" }] }
    ] },
  { slug: "sequence-diagrams", group: "작성법", title: "시퀀스 다이어그램",
    lede: "같은 단계를 라이프라인으로 그려요. 구조보다 순서가 중요할 때 좋아요.",
    sections: [{ id: "switch", h: "레이아웃 전환", blocks: [{ t: "p", html: `첫 줄에 ${ic("diagram sequence")}만 넣으세요. 분기를 비롯해 나머지 줄은 손댈 필요 없어요.` },
      { t: "player", label: "체크아웃 시퀀스", code: "diagram sequence\ntitle Checkout sequence\nuser[User] -> api[Order API] : POST /checkout\napi -> redis[Redis]{shape: db} : check stock\nbranch in stock\n  redis --> api : OK\n  api -> pg[Payment Provider] : authorize\n  pg --> api : approved\n  api --> user : 201\nelse sold out\n  redis -x api : sold out\n  api --> user : 409\nend" }] }] },
  { slug: "player-controls", group: "레퍼런스", title: "플레이어 조작",
    lede: "어느 플레이어든 마우스와 키보드로 똑같이 조작해요.",
    sections: [
      { id: "buttons", h: "버튼", blocks: [{ t: "list", items: ["재생/일시정지로 재생을 켜고 꺼요.", "단계 이동은 한 단계 나아가고 멈춰요.", "속도로 재생 속도를 바꿔요.", "다이어그램에 분기가 있으면 선택지가 떠요."] }] },
      { id: "keyboard", h: "키보드", blocks: [{ t: "p", html: "먼저 플레이어를 한 번 클릭하세요." }, { t: "table", head: ["키", "동작"], rows: [[kbd("Space"), "재생 또는 일시정지"], [kbd("→"), "다음 단계"], [kbd("←"), "이전 단계"]] }] }
    ] },
  { slug: "icon-loading", group: "레퍼런스", title: "아이콘 불러오기",
    lede: "아이콘은 팩 이름이나 SVG 주소로 지정해요. 무엇을 가져올지는 ene가 제한해요.",
    sections: [
      { id: "sources", h: "가져오는 곳", blocks: [{ t: "list", items: [`${ic("logos:redis")} 같은 팩 이름. 등록해 둔 팩에서 가져와요.`, `SVG 주소: ${ic("http(s)://…")}, ${ic("./")}, ${ic("../")}, ${ic("/")} 또는 ${ic("data:image/svg+xml,…")}.`] }] },
      { id: "limits", h: "제한", blocks: [{ t: "stats", items: [["5 s", "원격 아이콘당 타임아웃"], ["512 KiB", "최대 크기, 받는 동안 확인"], ["SVG", "허용하는 문서 형식은 이것뿐"]] }] },
      { id: "browser", h: "브라우저에서", blocks: [{ t: "code", file: "app.js", code: "ene.setIconLoading({ timeoutMs, maxBytes, allowHosts })" }] },
      { id: "cli", h: "명령줄에서", blocks: [{ t: "code", file: "terminal", code: "$ ene flow.ene -o flow.svg --no-network\n$ ene flow.ene -o flow.svg --allow-host icons.example.com" },
        { t: "callout", label: "참고", html: "아이콘을 못 불러와도 렌더링은 멈추지 않아요. 그 노드만 아이콘 없이 그려지고, 이유는 경고로 알려 줘요." }] }
    ] },
  { slug: "security", group: "레퍼런스", title: "보안",
    lede: "직접 쓰지 않은 콘텐츠를 ene가 어떻게 다루는지 알려 드려요.",
    sections: [
      { id: "icons", h: "아이콘은 이미지로만 넣어요", blocks: [{ t: "p", html: "SVG 파일이나 URL에서 불러온 아이콘은 이미지로 넣기 때문에 안에 든 스크립트는 실행되지 않아요." }] },
      { id: "labels", h: "레이블은 이스케이프해요", blocks: [{ t: "p", html: "레이블은 그리기 전에 모두 이스케이프해요." }] },
      { id: "packs", h: "팩은 검사를 거쳐요", blocks: [{ t: "p", html: "아이콘 팩은 쓰기 전에 접두사, 아이콘 본문, 숫자 크기를 검사하고, 본문은 격리된 이미지로 그려요." }] },
      { id: "fetch", h: "가져오기에는 제한이 있어요", blocks: [{ t: "p", html: `원격 아이콘은 타임아웃과 크기 제한을 둬요. 서버에서는 ${ic("--no-network")} 또는 ${ic("--allow-host")}를 쓰세요.` }] }
    ] }
];
export const groups = ["시작하기", "작성법", "레퍼런스"];
