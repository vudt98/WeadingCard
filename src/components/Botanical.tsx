export function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`botanical ${className}`}
      viewBox="0 0 220 330"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M42 327C72 254 109 163 160 18M72 256C24 236 18 199 22 177C54 184 80 206 72 256ZM89 216C124 206 151 175 154 149C119 150 94 177 89 216ZM108 164C67 146 65 119 68 98C96 104 116 128 108 164ZM128 111C161 98 184 69 183 47C155 53 132 78 128 111ZM148 53C127 34 135 12 149 2C160 17 160 33 148 53Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M70 257L32 193M90 217L143 160M108 163L76 109M128 111L176 57"
        stroke="currentColor"
        strokeWidth=".7"
      />
    </svg>
  );
}
