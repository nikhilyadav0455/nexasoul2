'use client';

import {
  memo,
  ReactNode,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const Input = memo(
  forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function Input({ className, type, ...props }, ref) {
      const radius = 100;
      const [visible, setVisible] = useState(false);
      const mouseX = useMotionValue(0);
      const mouseY = useMotionValue(0);

      function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
      }: React.MouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }

      return (
        <motion.div
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
                #3b82f6,
                transparent 80%
              )
            `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className='group/input rounded-lg p-[2px] transition duration-300'
        >
          <input
            type={type}
            className={cn(
              'shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600',
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.div>
      );
    }
  )
);

Input.displayName = 'Input';

type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
};

const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor,
  duration,
  overflow = 'hidden',
  position = 'relative',
  className,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    } else {
      slideControls.start('hidden');
      mainControls.start('hidden');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position as
          | 'relative'
          | 'absolute'
          | 'fixed'
          | 'sticky'
          | 'static',
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial='hidden'
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? '#5046e6',
          borderRadius: 4,
        }}
      />
    </section>
  );
});

type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = '',
}: RippleProps) {
  return (
    <section
      className={`max-w-[50%] absolute inset-0 flex items-center justify-center dark:bg-white/5 bg-neutral-50 [mask-image:linear-gradient(to_bottom,black,transparent)] dark:[mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';

        return (
          <span
            key={i}
            className='absolute animate-ripple rounded-full border bg-foreground/15'
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: '1px',
              borderColor: `var(--foreground)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </section>
  );
});

type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          className='pointer-events-none absolute inset-0 size-full'
        >
          <circle
            className='stroke-black/10 stroke-1 dark:stroke-white/10'
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
          />
        </svg>
      )}
      <section
        style={{
          '--duration': duration,
          '--radius': radius,
          '--delay': -delay,
        } as React.CSSProperties}
        className={cn(
          'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/10',
          { '[animation-direction:reverse]': reverse },
          className
        )}
      >
        {children}
      </section>
    </>
  );
});

type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactNode;
};

type TechnologyOrbitDisplayProps = {
  iconsArray: IconConfig[];
  text?: string;
};

const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = 'Animated Login',
}: TechnologyOrbitDisplayProps) {
  return (
    <section className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg'>
      <span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10'>
        {text}
      </span>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

type FieldType = 'text' | 'email' | 'password';

type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  fieldPerRow?: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type Errors = {
  [key: string]: string;
};

const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  errorField,
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  goTo,
}: AnimatedFormProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setVisible((value) => !value);

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const currentErrors: Errors = {};

    fields.forEach((field) => {
      const input = (event.currentTarget.elements.namedItem(field.label) as HTMLInputElement | null);
      const value = input?.value ?? '';

      if (field.required && !value) {
        currentErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        currentErrors[field.label] = 'Invalid email address';
      }

      if (field.type === 'password' && value && value.length < 6) {
        currentErrors[field.label] = 'Password must be at least 6 characters long';
      }
    });

    return currentErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(event);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className='mx-auto flex w-96 max-md:w-full flex-col gap-4'>
      <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
        <h2 className='text-3xl font-bold text-neutral-800 dark:text-neutral-200'>
          {header}
        </h2>
      </BoxReveal>

      {subHeader && (
        <BoxReveal boxColor='var(--skeleton)' duration={0.3} className='pb-2'>
          <p className='max-w-sm text-sm text-neutral-600 dark:text-neutral-300'>
            {subHeader}
          </p>
        </BoxReveal>
      )}

      {googleLogin && (
        <>
          <BoxReveal
            boxColor='var(--skeleton)'
            duration={0.3}
            overflow='visible'
            width='unset'
          >
            <button
              className='g-button group/btn h-10 w-full rounded-md bg-transparent font-medium outline-hidden hover:cursor-pointer'
              type='button'
            >
              <span className='flex h-full w-full items-center justify-center gap-3'>
                <Image
                  src='https://cdn.21st.dev/assets/mirror/89/8948eafec4a9c68b2b3a78a756b4474c05e53431f208149556fb669e3c429be2.png'
                  width={26}
                  height={26}
                  alt='Google Icon'
                />
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>

          <BoxReveal boxColor='var(--skeleton)' duration={0.3} width='100%'>
            <section className='flex items-center gap-4'>
              <hr className='flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700' />
              <p className='text-sm text-neutral-700 dark:text-neutral-300'>or</p>
              <hr className='flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700' />
            </section>
          </BoxReveal>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <section className={cn('mb-4 grid grid-cols-1', fieldPerRow > 1 && 'md:grid-cols-2')}>
          {fields.map((field) => (
            <section key={field.label} className='flex flex-col gap-2'>
              <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
                <Label htmlFor={field.label}>
                  {field.label} <span className='text-red-500'>*</span>
                </Label>
              </BoxReveal>

              <BoxReveal
                width='100%'
                boxColor='var(--skeleton)'
                duration={0.3}
                className='flex w-full flex-col space-y-2'
              >
                <section className='relative'>
                  <Input
                    type={field.type === 'password' ? (visible ? 'text' : 'password') : field.type}
                    id={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                  />

                  {field.type === 'password' && (
                    <button
                      type='button'
                      onClick={toggleVisibility}
                      className='absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-neutral-600'
                    >
                      {visible ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}
                    </button>
                  )}
                </section>

                <section className='h-4'>
                  {errors[field.label] && (
                    <p className='text-xs text-red-500'>{errors[field.label]}</p>
                  )}
                </section>
              </BoxReveal>
            </section>
          ))}
        </section>

        <BoxReveal width='100%' boxColor='var(--skeleton)' duration={0.3}>
          {errorField && <p className='mb-4 text-sm text-red-500'>{errorField}</p>}
        </BoxReveal>

        <BoxReveal
          width='100%'
          boxColor='var(--skeleton)'
          duration={0.3}
          overflow='visible'
        >
          <button
            className='group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-zinc-200 to-zinc-200 text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] outline-hidden hover:cursor-pointer dark:from-zinc-900 dark:to-zinc-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'
            type='submit'
          >
            {submitButton} &rarr;
            <BottomGradient />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
            <section className='mt-4 text-center hover:cursor-pointer'>
              <button
                type='button'
                className='text-sm text-blue-500 outline-hidden hover:cursor-pointer'
                onClick={goTo}
              >
                {textVariantButton}
              </button>
            </section>
          </BoxReveal>
        )}
      </form>
    </section>
  );
});

const BottomGradient = () => {
  return (
    <>
      <span className='group-hover/btn:opacity-100 absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500' />
      <span className='group-hover/btn:opacity-100 absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500' />
    </>
  );
};

interface AuthTabsProps {
  formFields: {
    header: string;
    subHeader?: string;
    fields: Array<{
      label: string;
      required?: boolean;
      type: FieldType;
      placeholder: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }>;
    submitButton: string;
    textVariantButton?: string;
  };
  goTo: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AuthTabs = memo(function AuthTabs({
  formFields,
  goTo,
  handleSubmit,
}: AuthTabsProps) {
  return (
    <div className='flex w-full max-lg:justify-center md:w-auto'>
      <div className='flex h-[100dvh] w-full flex-col items-center justify-center lg:w-1/2 max-lg:px-[10%]'>
        <AnimatedForm
          {...formFields}
          fieldPerRow={1}
          onSubmit={handleSubmit}
          goTo={goTo}
          googleLogin='Login with Google'
        />
      </div>
    </div>
  );
});

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const Label = memo(function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
});

type FormData = {
  email: string;
  password: string;
};

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/34/34826e5b3315daadf4fa15f723a3c1d5ba4a89277bfd94e22ac4d7d3d54338c5.svg'
        alt='HTML5'
      />
    ),
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 20,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/36/36b7d94b657d571d3f94042acbf6a4c86a5301a222f83f4b4583ad2acf6e297d.svg'
        alt='CSS3'
      />
    ),
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 10,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/c9/c9191199f4049920c2fc19035b8a6664f37f4689fcd9e8434e786097e78863f0.svg'
        alt='TypeScript'
      />
    ),
    className: 'size-[50px] border-none bg-transparent',
    radius: 210,
    duration: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/06/0656ff65fc8eeacda5c78d7f9ffe91ec1eb919db64f56e0b7dcd460af4bbd36c.svg'
        alt='JavaScript'
      />
    ),
    className: 'size-[50px] border-none bg-transparent',
    radius: 210,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/f8/f8cec54589553807eb603bcaf4e056aa090196211698b056542e3cc62a2f3448.svg'
        alt='TailwindCSS'
      />
    ),
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 20,
    radius: 150,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/d9/d9435c4ede7133b376c0173a80226bb3856729366707cd96e9a66e39448d0288.svg'
        alt='Next.js'
      />
    ),
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 10,
    radius: 150,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/58/5825b649c8c04dec13ecf01d0182401bd0ec71789d2fa06224866d882cd1515f.svg'
        alt='React'
      />
    ),
    className: 'size-[50px] border-none bg-transparent',
    radius: 270,
    duration: 20,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/d3/d37c2bf1a1d4f10aeffb224e44da672cb8b9510f6e5a2e24b61758262995805e.svg'
        alt='Figma'
      />
    ),
    className: 'size-[50px] border-none bg-transparent',
    radius: 270,
    duration: 20,
    delay: 60,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.21st.dev/assets/mirror/71/717a57ea97bf7e86de721dab3e68afac66332a10676d5c9abce4ae6a5a9c9983.svg'
        alt='Git'
      />
    ),
    className: 'size-[50px] border-none bg-transparent',
    radius: 320,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
];

export function Demo() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const goToForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    console.log('forgot password');
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted', formData);
  };

  const formFields = {
    header: 'Welcome back',
    subHeader: 'Sign in to your account',
    fields: [
      {
        label: 'Email',
        required: true,
        type: 'email' as const,
        placeholder: 'Enter your email address',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'email'),
      },
      {
        label: 'Password',
        required: true,
        type: 'password' as const,
        placeholder: 'Enter your password',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ],
    submitButton: 'Sign in',
    textVariantButton: 'Forgot password?',
  };

  return (
    <section className='flex max-lg:justify-center'>
      <span className='flex w-1/2 flex-col justify-center max-lg:hidden'>
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} />
      </span>

      <span className='flex h-[100dvh] w-1/2 flex-col items-center justify-center max-lg:w-full max-lg:px-[10%]'>
        <AuthTabs
          formFields={formFields}
          goTo={goToForgotPassword}
          handleSubmit={handleSubmit}
        />
      </span>
    </section>
  );
}

export {
  Input,
  BoxReveal,
  Ripple,
  OrbitingCircles,
  TechOrbitDisplay,
  AnimatedForm,
  AuthTabs,
  Label,
  BottomGradient,
};
