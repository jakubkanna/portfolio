import { useState } from "react";
import Section from "../Section/Section";

import Button from "../Button/Button";
import MoveIn from "../animated/MoveIn/MoveIn";

export default function CVSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);

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
        <div className="content">
          <>
            {!isVisible ? (
              <MoveIn>
                <Button onClick={triggerForm}>Download CV</Button>
              </MoveIn>
            ) : (
              <div id="mc_embed_signup">
                <form
                  action="https://jakubkanna.us20.list-manage.com/subscribe/post?u=837187f00032092e6c9a48147&amp;id=7ab2644c97&amp;f_id=009a5eeef0"
                  method="post"
                  target="_blank"
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
        </div>
      </div>
    </Section>
  );
}
