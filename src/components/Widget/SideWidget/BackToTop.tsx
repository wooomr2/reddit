import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const BackToTop: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(window.innerHeight - 60);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 100 ? setIsScrolled(true) : setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      maxW="130"
      alignSelf="center"
      position="sticky"
      display={isScrolled ? "initial" : "none"}
      top={top}
      onClick={() => window.scrollTo(0, 0)}
    >
      Back To Top
    </Button>
  );
};
export default BackToTop;
