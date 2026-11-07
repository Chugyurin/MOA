export default function PreparationIllustration() {
  return (
    <figure className="preparation-illustration">
      <svg
        viewBox="0 0 560 490"
        role="img"
        aria-labelledby="preparation-art-title preparation-art-desc"
      >
        <title id="preparation-art-title">
          약봉지를 카세트에 넣으면 자동으로 잘라 한 번분을 컵에 담는 과정
        </title>
        <desc id="preparation-art-desc">
          왼쪽의 작은 카세트에 연결된 약봉지를 그대로 넣습니다. 화살표를 따라
          기기 안으로 들어간 약봉지는 절단부에서 열리고, 약이 아래 컵으로
          모입니다. 작동 원리를 설명하는 콘셉트 그림입니다.
        </desc>
        <defs>
          <linearGradient id="prep-body" x1="0" y1="0" x2="1" y2=".4">
            <stop stopColor="#fff" />
            <stop offset=".65" stopColor="#f0f4f8" />
            <stop offset="1" stopColor="#dce4ee" />
          </linearGradient>
          <linearGradient id="prep-window" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#e4ecf6" />
            <stop offset="1" stopColor="#f7f9fc" />
          </linearGradient>
          <linearGradient id="prep-cup" x1="0" y1="0" x2="1" y2=".3">
            <stop stopColor="#fff" />
            <stop offset=".6" stopColor="#edf2f8" />
            <stop offset="1" stopColor="#c9d7e8" />
          </linearGradient>
          <filter id="prep-shadow" x="-40%" y="-30%" width="180%" height="180%">
            <feDropShadow
              dx="5"
              dy="14"
              stdDeviation="12"
              floodColor="#536f95"
              floodOpacity=".13"
            />
          </filter>
          <marker
            id="prep-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1 8 5 2 9"
              fill="none"
              stroke="#6c91c4"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>
        <ellipse
          cx="340"
          cy="447"
          rx="165"
          ry="15"
          fill="#6687b0"
          opacity=".09"
        />
        {/* The device is shown in cutaway so the path stays visible. */}
        <rect
          x="215"
          y="45"
          width="257"
          height="390"
          rx="35"
          fill="url(#prep-body)"
          stroke="#e1e8f0"
          filter="url(#prep-shadow)"
        />
        <path
          d="M244 63H441"
          stroke="#e0e7ef"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="245"
          y="89"
          width="195"
          height="239"
          rx="22"
          fill="url(#prep-window)"
          stroke="#d5e0ee"
        />
        <text x="342" y="114" textAnchor="middle" fill="#71859f" fontSize="12">
          기기 내부 작동 예시
        </text>
        {/* One cassette beside the device, holding a connected sachet strip. */}
        <text
          x="91"
          y="127"
          textAnchor="middle"
          fill="#4c678a"
          fontSize="16"
          fontWeight="600"
        >
          약봉지 카세트
        </text>
        <g filter="url(#prep-shadow)">
          <path
            d="M26 169 49 149H145L160 166V266H26Z"
            fill="#edf2f8"
            stroke="#cbd8e8"
          />
          <path d="M26 169H139L160 149" fill="none" stroke="#d2deed" />
          <rect x="39" y="178" width="105" height="69" rx="9" fill="#dae5f2" />
          <path
            d="M48 229V188H72V229H96V188H120V229H137"
            fill="none"
            stroke="#fff"
            strokeWidth="14"
            strokeLinejoin="round"
          />
          <path
            d="M48 229V188H72V229H96V188H120V229H137"
            fill="none"
            stroke="#c6d5e8"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <rect
            x="50"
            y="202"
            width="9"
            height="15"
            rx="4.5"
            fill="#e2c38b"
            transform="rotate(-15 54 210)"
          />
          <rect x="97" y="203" width="11" height="11" rx="5" fill="#e2c38b" />
          <rect x="65" y="258" width="57" height="4" rx="2" fill="#b8c9df" />
        </g>
        <path
          d="M164 202H232"
          fill="none"
          stroke="#6c91c4"
          strokeWidth="2"
          strokeDasharray="5 5"
          markerEnd="url(#prep-arrow)"
        />
        {/* Linked pouches run down through the cutting line. */}
        <g fill="#ffffffd9" stroke="#c2d2e6">
          <rect x="307" y="128" width="69" height="53" rx="5" />
          <rect x="307" y="181" width="69" height="59" rx="5" />
        </g>
        <path
          d="M312 135H371M312 174H371M312 188H371"
          stroke="#cedaeb"
          strokeWidth="2"
          strokeDasharray="2 3"
        />
        <rect
          x="322"
          y="145"
          width="11"
          height="23"
          rx="5.5"
          fill="#d7e2ed"
          transform="rotate(22 328 155)"
        />
        <circle cx="352" cy="157" r="7" fill="#ddc38c" />
        <rect
          x="324"
          y="200"
          width="12"
          height="22"
          rx="6"
          fill="#d4e0ee"
          transform="rotate(-22 330 210)"
        />
        <circle cx="354" cy="211" r="7" fill="#ddc38c" />
        <path
          d="M297 178V216"
          fill="none"
          stroke="#8fa8c7"
          strokeWidth="1.5"
          markerEnd="url(#prep-arrow)"
        />
        {/* Cut line, blade and scissors symbol. */}
        <rect x="283" y="235" width="117" height="13" rx="5" fill="#89a6cc" />
        <path
          d="M286 241H396"
          stroke="#fff"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <path
          d="M312 248 318 253 324 248 330 253 336 248 342 253 348 248 354 253 360 248 366 253 372 248"
          fill="none"
          stroke="#c1d1e5"
          strokeWidth="1.5"
        />
        <path d="M404 241H477" stroke="#91a9ca" strokeWidth="1.5" />
        <g stroke="#547fb8" strokeWidth="1.8" fill="none" strokeLinecap="round">
          <circle cx="489" cy="230" r="4" />
          <circle cx="489" cy="242" r="4" />
          <path d="M493 232 506 243M493 240 506 229" />
        </g>
        <text
          x="494"
          y="267"
          textAnchor="middle"
          fill="#4c678a"
          fontSize="15"
          fontWeight="600"
        >
          자동 커팅
        </text>
        {/* Loose pills, not packets, drop into the cup. */}
        <rect
          x="327"
          y="270"
          width="10"
          height="20"
          rx="5"
          fill="#bdcfe5"
          transform="rotate(25 332 280)"
        />
        <circle cx="354" cy="290" r="6" fill="#ddc38c" />
        <path
          d="M314 270V310"
          fill="none"
          stroke="#8fa8c7"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          markerEnd="url(#prep-arrow)"
        />
        <path
          d="M293 311 316 337H367L391 311"
          fill="#d7e2ef"
          stroke="#c5d4e7"
        />
        <path
          d="M324 338V352M357 338V350"
          stroke="#8fa8c7"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        <path
          d="M286 362H397L387 398Q342 424 296 398Z"
          fill="url(#prep-cup)"
          stroke="#d8e2ed"
        />
        <ellipse
          cx="341"
          cy="362"
          rx="55"
          ry="14"
          fill="#d5dfec"
          stroke="#fff"
          strokeWidth="6"
        />
        <rect
          x="314"
          y="357"
          width="22"
          height="10"
          rx="5"
          fill="#fff"
          transform="rotate(-15 325 362)"
        />
        <circle cx="348" cy="361" r="6" fill="#ddc38c" />
        <rect
          x="359"
          y="358"
          width="19"
          height="9"
          rx="4.5"
          fill="#b6cbe5"
          transform="rotate(16 369 362)"
        />
        <text
          x="341"
          y="461"
          textAnchor="middle"
          fill="#4c678a"
          fontSize="16"
          fontWeight="600"
        >
          한 번분이 한 컵에
        </text>
      </svg>
      <ol className="preparation-flow" aria-label="자동 준비 과정">
        <li>
          <span>1</span>약봉지 그대로
        </li>
        <li>
          <span>2</span>자동으로 커팅
        </li>
        <li>
          <span>3</span>한 컵에 모아
        </li>
      </ol>
      <figcaption>
        작동 원리를 설명하는 콘셉트 일러스트 · 실제 구조와 다를 수 있습니다
      </figcaption>
    </figure>
  );
}
