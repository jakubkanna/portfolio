import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Section from "../Section/Section";
import rehypeRaw from "rehype-raw";
import RehypeVideo from "rehype-video";
import isMobile from "is-mobile";
import remarkGfm from "remark-gfm";
import Button from "../Button/Button";

export default function CVSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  const [content, setContent] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Dynamically import the more.md file
    const markdownFiles = import.meta.glob("/docs/cv/*.md", { as: "raw" });

    const loadFile = async () => {
      const filePath = Object.keys(markdownFiles)[0];
      if (filePath) {
        const raw = await markdownFiles[filePath]();
        setContent(raw);
      }
    };

    loadFile();
  }, []);

  const triggerForm = () => {
    setIsVisible(true);
  };

  return (
    <Section
      id="CV"
      title="CV"
      containerYProgress={containerYProgress}
      threshold={threshold}
      label="cv"
    >
      <div className="container">
        {isMobile() ? (
          <>
            {!isVisible ? (
              <>
                <Button onClick={triggerForm}>
                  Send the CV directly to your email
                </Button>
              </>
            ) : (
              <div id="mc_embed_signup">
                <form
                  action="https://jakubkanna.us20.list-manage.com/subscribe/post?u=837187f00032092e6c9a48147&amp;id=7ab2644c97&amp;f_id=009a5eeef0"
                  method="post"
                  target="_blank"
                  noValidate
                >
                  <div>
                    <input
                      type="email"
                      name="EMAIL"
                      placeholder="your-email@example.com*"
                      required
                      id="mce-EMAIL"
                      className="required email"
                    />{" "}
                  </div>
                  <input type="hidden" name="tags" value="4227759" />
                  <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_837187f00032092e6c9a48147_7ab2644c97"
                      tabIndex={-1}
                      defaultValue=""
                    />
                  </div>
                  <div className="clear foot">
                    <input
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="btn"
                      value="Send"
                    />
                  </div>
                </form>
                <small>
                  * Your email will be used to send the CV via Mailchimp and
                  stored securely for contact purposes. You can unsubscribe
                  anytime.
                </small>
              </div>
            )}
          </>
        ) : (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[RehypeVideo, { details: false }], rehypeRaw]}
          >
            {content}
          </Markdown>
        )}
      </div>
    </Section>
  );
}
