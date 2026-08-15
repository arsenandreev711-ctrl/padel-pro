import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Политика конфиденциальности — MatePoint",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors w-fit"
      >
        <ArrowLeft size={15} /> На главную
      </Link>
      <h1 className="text-4xl sm:text-5xl font-bold display">Политика конфиденциальности</h1>

      <div className="flex flex-col gap-5 text-ink-soft leading-relaxed">
        <p>
          MatePoint — платформа падел- и теннис-сообщества Кыргызстана. Мы бережно
          относимся к твоим данным и собираем только то, что нужно для работы сервиса.
        </p>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold display text-ink">Какие данные мы собираем</h2>
          <p>
            Имя и фамилию, номер телефона, город и, по желанию, фото профиля. Также
            сохраняем твою игровую активность: уровень, рейтинг, игры, турниры и
            результаты матчей.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold display text-ink">Зачем</h2>
          <p>
            Чтобы ты мог входить в аккаунт, находить партнёров по игре, записываться на
            игры и турниры, вести профиль и рейтинг. Твой номер виден организаторам игр,
            в которых ты участвуешь, — чтобы вы могли связаться.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold display text-ink">Хранение</h2>
          <p>
            Данные хранятся на защищённых серверах нашего провайдера (Supabase). Мы не
            продаём и не передаём твои данные третьим лицам для рекламы.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold display text-ink">Твои права</h2>
          <p>
            Ты можешь изменить свои данные в профиле в любой момент, а также попросить
            удалить аккаунт — напиши нам, и мы удалим твои данные.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold display text-ink">Контакт</h2>
          <p>
            По вопросам о данных пиши организаторам проекта через контакты в сообществе
            MatePoint.
          </p>
        </div>

        <p className="text-sm text-ink-soft/70">
          Регистрируясь в MatePoint, ты соглашаешься с обработкой своих данных на этих
          условиях.
        </p>
      </div>
    </div>
  );
}
