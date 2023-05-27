import Link from "next/link";
import { classNames } from "@documenso/lib";

export default function Logo(props: any) {
  return (
    <>
      <Link href="/dashboard">
        <svg viewBox="0 0 64 64" {...props}>
          <rect width="88.6758041381836" height="32.18000030517578" fill="transparent"></rect>
          <path
            d="M27.07 9.25832C26.333 9.92796 25.5176 10.7145 24.5857 11.6341C23.9957 12.0973 23.2682 12.3587 22.5117 12.3733L19.3896 12.4333L20.2992 11.5237C25.815 6.0079 28.5729 3.25 32 3.25C35.4271 3.25 38.185 6.00789 43.7008 11.5237L44.6087 12.4317L41.5937 12.3749C40.7437 12.3588 39.9292 12.0311 39.3051 11.4539L37.4972 9.78198C37.3255 9.6212 37.1581 9.46631 36.9946 9.31712L36.897 9.22687L36.8953 9.22687C36.2778 8.667 35.7153 8.18958 35.1851 7.78508C33.6538 6.6167 32.7624 6.35263 32 6.35263C31.2376 6.35263 30.3462 6.6167 28.8149 7.78508C28.2783 8.19451 27.7085 8.67864 27.0821 9.24737L27.0814 9.24737L27.07 9.25832Z"
            fill="black"
          />
          <path
            d="M54.6826 27.0051C54.5337 26.8419 54.3791 26.6748 54.2187 26.5035L52.5459 24.6946C51.9691 24.0709 51.6413 23.2571 51.6249 22.4077L51.5667 19.3896L52.4763 20.2992C57.9921 25.815 60.75 28.5729 60.75 32C60.75 35.4271 57.9921 38.185 52.4763 43.7008L51.5667 44.6104L51.6249 41.5923C51.6413 40.7429 51.9691 39.9291 52.5459 39.3054L54.2185 37.4968C54.379 37.3253 54.5337 37.1581 54.6827 36.9948L54.7731 36.897V36.8953C55.333 36.2778 55.8104 35.7153 56.2149 35.1851C57.3833 33.6538 57.6474 32.7624 57.6474 32C57.6474 31.2376 57.3833 30.3462 56.2149 28.8149C55.8104 28.2847 55.333 27.7222 54.7731 27.1047V27.103L54.6826 27.0051Z"
            fill="black"
          />
          <path
            d="M36.9601 54.7143C37.1446 54.5464 37.334 54.3711 37.5289 54.1883L39.3054 52.5457C39.9294 51.9687 40.7435 51.6411 41.5932 51.6249L44.6096 51.5675L43.7008 52.4763C38.185 57.9921 35.4271 60.75 32 60.75C28.5729 60.75 25.815 57.9921 20.2992 52.4763L19.3896 51.5667L22.4141 51.6248C23.2599 51.641 24.0705 51.9659 24.6934 52.5383L25.9131 53.6592C27.0267 54.726 27.9626 55.5647 28.8149 56.2149C30.3462 57.3833 31.2376 57.6474 32 57.6474C32.7624 57.6474 33.6538 57.3833 35.1851 56.2149C35.7217 55.8055 36.2915 55.3214 36.9179 54.7526H36.9187L36.9601 54.7143Z"
            fill="black"
          />
          <path
            d="M9.26202 36.9341C9.44675 37.1373 9.64036 37.3465 9.8432 37.5625L11.4547 39.3051C12.0317 39.929 12.3594 40.7431 12.3756 41.5927L12.4333 44.6104L11.5237 43.7008C6.0079 38.185 3.25 35.4271 3.25 32C3.25 28.5729 6.00789 25.815 11.5237 20.2992L12.4325 19.3904L12.3754 22.4067C12.3593 23.2567 12.0314 24.0711 11.4541 24.6952L9.79271 26.4913C9.62762 26.6675 9.46871 26.8392 9.3158 27.0069L9.22687 27.103L9.22687 27.1047C8.66699 27.7222 8.18958 28.2847 7.78508 28.8149C6.6167 30.3462 6.35263 31.2376 6.35263 32C6.35263 32.7624 6.6167 33.6538 7.78508 35.1851C8.1946 35.7219 8.67887 36.2918 9.24777 36.9184L9.24777 36.9187L9.26202 36.9341Z"
            fill="black"
          />
          <path
            d="M9.24777 27.0804L11.4541 24.6952C11.9658 24.1421 12.2815 23.4395 12.3579 22.6951C12.367 21.4688 12.387 20.3991 12.4313 19.4536L12.4337 19.3242L12.4377 19.3202C12.4785 18.5034 12.5382 17.7805 12.6257 17.1297C12.8823 15.2207 13.3259 14.4037 13.865 13.8646C14.4041 13.3255 15.2211 12.882 17.1301 12.6253C17.7929 12.5362 18.5306 12.4759 19.3661 12.4351L19.3675 12.4337L19.4131 12.4329C20.3923 12.3861 21.5054 12.3657 22.7886 12.3569C23.5626 12.2798 24.2914 11.9441 24.8545 11.3998L27.0813 9.24742H25.7951C17.9946 9.24742 14.0944 9.24742 11.6711 11.6707C9.24777 14.094 9.24777 17.9943 9.24777 25.7948V27.0804Z"
            fill="black"
          />
          <path
            d="M9.24777 36.9187V38.2053C9.24777 46.0058 9.24777 49.9061 11.6711 52.3294C14.0944 54.7527 17.9946 54.7527 25.7951 54.7527H38.2057C46.0062 54.7527 49.9064 54.7527 52.3297 52.3294C54.753 49.9061 54.753 46.0058 54.753 38.2053V36.9187L52.5459 39.3054C52.0356 39.8571 51.7203 40.5577 51.643 41.3C51.6337 42.5529 51.613 43.6424 51.5668 44.603L51.5663 44.6325L51.5654 44.6334C51.5246 45.4693 51.4643 46.2073 51.3752 46.8704C51.1185 48.7794 50.6749 49.5964 50.1358 50.1355C49.5967 50.6746 48.7797 51.1181 46.8707 51.3748C46.2197 51.4623 45.4965 51.522 44.6793 51.5628L44.6758 51.5663L44.5626 51.5684C43.6127 51.6132 42.5373 51.6334 41.3032 51.6426C40.5597 51.7193 39.858 52.0347 39.3054 52.5457L36.9187 54.7526L27.103 54.7526L24.6934 52.5383C24.1424 52.032 23.4445 51.7193 22.7052 51.6426C21.4558 51.6334 20.3688 51.6129 19.4101 51.5671L19.3675 51.5663L19.3662 51.565C18.5307 51.5242 17.7929 51.4639 17.1301 51.3748C15.2211 51.1181 14.4041 50.6746 13.865 50.1355C13.3259 49.5964 12.8823 48.7794 12.6257 46.8704C12.5365 46.2075 12.4763 45.4698 12.4355 44.6342L12.4337 44.6325L12.4326 44.5753C12.3874 43.6221 12.367 42.5422 12.3579 41.3022C12.281 40.559 11.9655 39.8575 11.4547 39.3051L9.24777 36.9187Z"
            fill="black"
          />
          <path
            d="M51.643 22.7C51.7203 23.4423 52.0356 24.1428 52.5459 24.6946L54.753 27.0813V25.7948C54.753 17.9943 54.753 14.094 52.3297 11.6707C49.9064 9.24742 46.0062 9.24742 38.2057 9.24742H36.9192L39.3051 11.4539C39.8586 11.9658 40.5618 12.2815 41.3067 12.3575C42.5257 12.3666 43.5898 12.3865 44.531 12.4302L44.7192 12.4337L44.725 12.4396C45.5235 12.4803 46.2319 12.5394 46.8707 12.6253C48.7797 12.882 49.5967 13.3255 50.1358 13.8646C50.6749 14.4037 51.1185 15.2207 51.3752 17.1297C51.4643 17.7928 51.5246 18.5307 51.5654 19.3666L51.5663 19.3675L51.5668 19.3971C51.613 20.3577 51.6337 21.4471 51.643 22.7Z"
            fill="black"
          />
          <path
            d="M29.6453 18.2543L27.5526 20.0304C27.1792 20.3474 26.7112 20.5317 26.2219 20.5545L22.7195 20.7177L24.5458 18.8913C28.071 15.3661 29.8336 13.6035 32.0239 13.6035C34.2142 13.6035 35.9768 15.3661 39.502 18.8913L41.3172 20.7065L37.7657 20.5526C37.2678 20.531 36.7917 20.3422 36.4143 20.0167L34.8345 18.6538C34.2799 18.1319 33.8096 17.7194 33.3805 17.392C32.5014 16.7212 32.168 16.706 32.0239 16.7059C31.8799 16.7059 31.5465 16.7212 30.6674 17.392C30.6533 17.4027 30.6393 17.4135 30.6252 17.4243L30.6232 17.4243L30.6024 17.4419C30.3079 17.6703 29.9934 17.9385 29.6453 18.2543Z"
            fill="black"
          />
          <path
            d="M46.4935 30.4715C45.8957 29.7157 45.0376 28.8234 43.7954 27.5741C43.5923 27.2496 43.4753 26.8756 43.4596 26.4879L43.306 22.6953L45.1106 24.4999C48.6358 28.0251 50.3985 29.7878 50.3985 31.978C50.3985 34.1683 48.6358 35.9309 45.1106 39.4561L43.2963 41.2705L43.4711 37.6457C43.4954 37.142 43.6908 36.6617 44.025 36.284L45.352 34.7845C45.7709 34.3392 46.1192 33.9484 46.4095 33.5895L46.573 33.4048V33.3829C46.5854 33.3667 46.5978 33.3506 46.61 33.3346C47.2808 32.4555 47.296 32.1221 47.296 31.978C47.296 31.834 47.2808 31.5006 46.61 30.6215C46.5978 30.6054 46.5854 30.5894 46.573 30.5732V30.555L46.4935 30.4715Z"
            fill="black"
          />
          <path
            d="M17.4826 30.5696L19.902 27.9386C20.2447 27.566 20.4494 27.0873 20.4821 26.5821L20.616 24.5168C20.6363 23.8629 20.6699 23.3105 20.7254 22.829L20.7349 22.6825L20.7445 22.673C20.7466 22.6564 20.7488 22.6398 20.751 22.6234C20.8983 21.5275 21.1233 21.2809 21.2251 21.1791C21.327 21.0772 21.5736 20.8523 22.6695 20.7049C23.0213 20.6576 23.4118 20.6238 23.8544 20.5996L26.8259 20.3064C27.3027 20.2594 27.7513 20.0591 28.1046 19.7357L30.6159 17.4365H28.0583C23.0729 17.4365 20.5802 17.4365 19.0314 18.9853C17.712 20.3048 17.5166 22.3093 17.4877 25.9566C17.4826 26.5905 17.4826 27.274 17.4826 28.0122L17.4826 30.5632V30.5696Z"
            fill="black"
          />
          <path
            d="M17.4826 33.3865V33.3957L17.4826 35.9439C17.4826 36.6821 17.4826 37.3656 17.4877 37.9995C17.5166 41.6468 17.7119 43.6514 19.0314 44.9708C20.3509 46.2903 22.3554 46.4856 26.0028 46.5146C26.6366 46.5196 27.3201 46.5196 28.0583 46.5196H30.6059H33.4384H35.99C36.728 46.5196 37.4114 46.5196 38.0451 46.5146C41.6927 46.4856 43.6974 46.2903 45.0169 44.9708C46.5657 43.422 46.5657 40.9293 46.5657 35.9439V33.3787L43.9873 36.1746C43.7295 36.4542 43.5498 36.7933 43.462 37.158C43.457 38.9702 43.4324 40.2302 43.3142 41.2003L43.313 41.252L43.3071 41.2579C43.3039 41.283 43.3006 41.308 43.2973 41.3327C43.15 42.4286 42.925 42.6752 42.8231 42.7771C42.7213 42.8789 42.4747 43.1039 41.3788 43.2512C41.3541 43.2545 41.3291 43.2578 41.304 43.261L41.2979 43.2671L41.2111 43.2724C40.6594 43.3378 40.0141 43.3737 39.2282 43.3934L37.4602 43.5013C36.9569 43.5321 36.4791 43.7335 36.1058 44.0725L33.4107 46.5196H30.5938L27.8997 44.0008C27.5451 43.6693 27.0925 43.4643 26.612 43.4152C26.4039 43.4144 26.2033 43.4132 26.0098 43.4117C24.5576 43.3999 23.5048 43.3635 22.6695 43.2512C21.5736 43.1039 21.327 42.8789 21.2251 42.7771C21.1233 42.6752 20.8983 42.4286 20.751 41.3327C20.7488 41.3163 20.7466 41.2998 20.7445 41.2832L20.7349 41.2737L20.734 41.2529L20.7304 41.1702C20.6321 40.3446 20.6002 39.3097 20.5899 37.9068L20.5744 37.5474C20.5703 37.451 20.5598 37.3554 20.5434 37.2613C20.4714 36.8491 20.2836 36.4635 19.9993 36.1511L17.4826 33.3865Z"
            fill="black"
          />
          <path
            d="M43.4361 24.6464L43.5814 26.617C43.6181 27.1141 43.8212 27.5842 44.158 27.9516L46.5657 30.5773V28.0122C46.5657 23.0268 46.5657 20.5341 45.0169 18.9853C43.4681 17.4365 40.9754 17.4365 35.99 17.4365H33.4104L35.9941 19.7902C36.3562 20.1201 36.8173 20.3206 37.3055 20.3606L40.3018 20.6057C40.5881 20.6227 40.8522 20.6441 41.098 20.6709L41.3195 20.689L41.3288 20.6983C41.3455 20.7005 41.3622 20.7027 41.3788 20.7049C42.4747 20.8523 42.7213 21.0772 42.8231 21.1791C42.925 21.2809 43.15 21.5275 43.2973 22.6234C43.3724 23.1822 43.4136 23.8384 43.4361 24.6464Z"
            fill="black"
          />
          <path
            d="M20.7437 41.2626L20.734 41.2529L20.7349 41.2737L20.7445 41.2832L20.7437 41.2626Z"
            fill="black"
          />
          <path
            d="M22.7418 43.2607L26.0098 43.4117C24.5992 43.4003 23.5654 43.3656 22.7418 43.2607Z"
            fill="black"
          />
          <path
            d="M20.6049 37.695C20.5987 37.5479 20.578 37.4027 20.5434 37.2613C20.5598 37.3554 20.5703 37.451 20.5744 37.5474L20.5899 37.9068C20.6002 39.3097 20.6321 40.3446 20.7304 41.1702L20.734 41.2529L20.7437 41.2626L20.6049 37.695Z"
            fill="black"
          />
          <path
            d="M13.6494 31.978C13.6494 33.8441 14.9288 35.3997 17.4877 37.9995C17.4826 37.3656 17.4826 36.6821 17.4826 35.9439L17.4826 33.3957L17.4772 33.3895L17.4772 33.3858C17.464 33.3687 17.4508 33.3516 17.4379 33.3346C16.7671 32.4555 16.7518 32.1221 16.7518 31.978C16.7518 31.834 16.7671 31.5006 17.4379 30.6215C17.4526 30.6021 17.4675 30.5827 17.4826 30.5632L17.4826 28.0122C17.4826 27.274 17.4826 26.5905 17.4877 25.9566C14.9288 28.5563 13.6494 30.112 13.6494 31.978Z"
            fill="black"
          />
          <path
            d="M30.6674 46.5641C30.6549 46.5546 30.6425 46.5451 30.63 46.5354H30.6232L30.6059 46.5196H28.0583C27.3201 46.5196 26.6366 46.5196 26.0028 46.5146C28.6023 49.0732 30.1579 50.3526 32.0239 50.3526C33.8899 50.3526 35.4455 49.0732 38.0451 46.5146C37.4114 46.5196 36.728 46.5196 35.99 46.5196H33.4384C33.419 46.5346 33.3997 46.5494 33.3805 46.5641C32.5014 47.2348 32.168 47.2501 32.0239 47.2501C31.8799 47.2501 31.5465 47.2348 30.6674 46.5641Z"
            fill="black"
          />
        </svg>
      </Link>
    </>
  );
}
