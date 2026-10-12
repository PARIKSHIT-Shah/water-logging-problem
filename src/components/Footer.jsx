export default function Footer() {
  return (
    <footer className="bg-ink py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-2">
        <div>
          <p className="font-display text-2xl font-extrabold text-white">SHOW</p>
          <p className="mt-2 max-w-sm text-mist/70">
            A college project on waterlogging in Kolkata.
          </p>
          <p className="mt-4 text-sm text-mist/60">Made by: Your Team , Btech , CSE-AI , Techno India University</p>
        </div>
        <div className="text-sm leading-relaxed text-mist/65">
          <p>
            Weather data comes from{" "}
            <a className="text-rain underline underline-offset-4 hover:text-taxi" href="https://open-meteo.com" target="_blank" rel="noreferrer">
              Open Apis
            </a>
            . Monthly rainfall figures are approximate long-term averages.
          </p>
          <p className="mt-3">
            The risk score is an educational model, not an official warning. For real alerts, follow the India Meteorological Department and the Kolkata Municipal Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
