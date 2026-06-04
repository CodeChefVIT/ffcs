import { ZButton } from '@/components/ui/Buttons';
import { useRouter } from 'next/navigation';

type HeroMessageProps = {
  bigText: string;
  title: string;
  subtitle: string;
  mobile?: boolean;
};

export function ErrorCard({ bigText, title, subtitle, mobile = false }: HeroMessageProps) {
  const router = useRouter();

  const ui = mobile
    ? ({
        numberSize: 'text-[96px]',
        shadowOffset: 'left-1.5 top-1.5',
        stroke: '8px black',
        buttonType: 'regular' as const,
        textSize: 'text-xl mb-16',
      } as const)
    : ({
        numberSize: 'text-[160px]',
        shadowOffset: 'left-2 top-2',
        stroke: '16px black',
        buttonType: 'large' as const,
        textSize: 'text-3xl mb-8',
      } as const);

  return (
    <>
      <div className="relative w-fit h-fit mb-4 pb-3 pr-3">
        {/*Shadow*/}
        <span
          className={`absolute ${ui.shadowOffset} ${ui.numberSize} whitespace-nowrap select-none pointer-events-none font-poppins font-extrabold z-0 text-black`}
          style={{
            WebkitTextStroke: ui.stroke,
          }}
        >
          {bigText}
        </span>
        {/*Stroke*/}
        <span
          className={`absolute left-0 top-0 select-none pointer-events-none whitespace-nowrap font-poppins font-extrabold ${ui.numberSize} z-10 text-transparent`}
          style={{
            WebkitTextStroke: ui.stroke,
          }}
        >
          {bigText}
        </span>
        {/*Fill*/}
        <span
          className={`relative select-none pointer-events-none whitespace-nowrap font-poppins font-extrabold ${ui.numberSize} z-20 text-[#90BDFF]`}
        >
          {bigText}
        </span>
      </div>

      <div className={`${ui.textSize} font-pangolin text-black`}>
        {title}
        <br />
        {subtitle && subtitle}
      </div>

      <ZButton
        type={ui.buttonType}
        text="Home"
        color="purple"
        image="/icons/home.svg"
        onClick={() => router.push('/')}
      />
    </>
  );
}
