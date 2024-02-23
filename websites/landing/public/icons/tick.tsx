import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
}

export default function IconTick(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="12"
      fill="none"
      viewBox="0 0 10 8"
      className={twMerge(props.className)}
    >
      <path
        fill="#fff"
        d="M3.58 7.58a.75.75 0 01-.53-.22L.22 4.53a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l2.3 2.3L8.72.63c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L4.11 7.36a.75.75 0 01-.53.22z"
      ></path>
    </svg>
  );
}
