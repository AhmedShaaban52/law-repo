import Scene from "@/components/Scene";

export default function Home() {
  return (
    <>
      <Scene />
      <nav>
        <b>⚖ العدالة</b>
        <div>
          <a href="#about">من نحن</a>
          <a href="#services">خدماتنا</a>
          <a href="#contact">تواصل معنا</a>
        </div>
      </nav>

      <section id="home">
        <div className="box">
          <div className="tag reveal">
            مكتب العدالة للمحاماة والاستشارات القانونية
          </div>
          <h1 className="reveal">
            حيث تُصان الحقوق
            <br />
            وتُحفظ الأمانة
          </h1>
          <p className="reveal" style={{ marginTop: 16 }}>
            خبرة قانونية راسخة، ورؤية عصرية، والتزام كامل بمصلحة موكّلينا.
          </p>
          <a className="btn reveal" href="#contact">
            احجز استشارتك
          </a>
        </div>
      </section>

      <section id="about" className="right">
        <div className="box">
          <div className="tag reveal">من نحن</div>
          <h2 className="reveal">ثقة تُبنى بالعمل</h2>
          <p className="reveal">
            يضم مكتبنا نخبة من المحامين المتخصصين في القضايا التجارية والمدنية
            والجنائية وقضايا الأسرة، ونؤمن بأن كل قضية تستحق دراسة دقيقة
            واستراتيجية واضحة.
          </p>
        </div>
      </section>

      <section id="services">
        <div className="box">
          <div className="tag reveal">خدماتنا</div>
          <h2 className="reveal">مجالات الممارسة</h2>
          <div className="list">
            <div className="reveal">
              <b>القضايا التجارية</b>عقود، شركات، ونزاعات تجارية.
            </div>
            <div className="reveal">
              <b>القضايا المدنية والأسرة</b>تمثيل ومرافعة أمام جميع الدرجات.
            </div>
            <div className="reveal">
              <b>الاستشارات القانونية</b>رأي قانوني دقيق قبل كل قرار.
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="right">
        <div className="box">
          <div className="tag reveal">تواصل معنا</div>
          <h2 className="reveal">نبدأ بحديث هادئ</h2>
          <p className="reveal">
            أخبرنا بقضيتك، وسنعرض عليك الطريق القانوني الأوضح بسرية تامة.
          </p>
          <a className="btn reveal" href="#home">
            تواصل الآن
          </a>
        </div>
      </section>

      <footer>
        © ٢٠٢٦ مكتب العدالة للمحاماة – نموذج تجريبي لعرض إمكانيات التصميم ثلاثي
        الأبعاد
      </footer>
    </>
  );
}
