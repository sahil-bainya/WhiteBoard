import {
  FaLinkedinIn,
  FaGithub,
  FaChalkboardTeacher,
  FaInstagram,
} from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content items-center  p-2!">
      <aside className="grid-flow-col items-center">
        <FaChalkboardTeacher size={30} />
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="https://github.com/sahil-bainya" target="_blank">
          <FaGithub size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/sahil-bainya-097575327"
          target="_blank"
        >
          <FaLinkedinIn size={20} />
        </a>
        <a href="https://www.instagram.com/_sahil_artist_/" target="_blank">
          <FaInstagram size={20} />
        </a>
      </nav>
    </footer>
  );
}
