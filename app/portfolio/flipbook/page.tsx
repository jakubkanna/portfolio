"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Button from "../../components/Button";
import Loader from "@/app/components/Loader";

type PdfLib = {
  getDocument: (src: string) => { promise: Promise<PDFDocumentProxy> };
  GlobalWorkerOptions: { workerSrc: string };
};

type PDFDocumentProxy = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (options: { scale: number }) => {
      width: number;
      height: number;
    };
    render: (params: {
      canvas: HTMLCanvasElement;
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
  }>;
};

type JQueryStatic = ((element: Element | string) => {
  turn: (
    optionsOrMethod: string | Record<string, unknown>,
    ...args: unknown[]
  ) => unknown;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}) & {
  fn?: { turn?: unknown };
};

const MAX_PAGES = 40;

export default function PortfolioFlipbookPage() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTruncated, setIsTruncated] = useState(false);
  const [bookHeight, setBookHeight] = useState<number | null>(null);

  const bookRef = useRef<HTMLDivElement | null>(null);
  const jqueryRef = useRef<JQueryStatic | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  const pdfSrc = useMemo(() => "/okay.pdf", []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-fg", "#ffffff");
    return () => {
      root.style.removeProperty("--page-fg");
    };
  }, []);

  const renderPdfPage = useCallback(
    async (
      doc: PDFDocumentProxy,
      pageNumber: number,
      canvas: HTMLCanvasElement,
      targetWidth: number,
    ) => {
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const scale = targetWidth / viewport.width;
      const outputScale = window.devicePixelRatio || 1;
      const scaledViewport = page.getViewport({ scale: scale * outputScale });

      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = Math.floor(scaledViewport.width);
      canvas.height = Math.floor(scaledViewport.height);
      canvas.style.width = `${Math.floor(viewport.width * scale)}px`;
      canvas.style.height = `${Math.floor(viewport.height * scale)}px`;

      await page.render({
        canvas,
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;
    },
    [],
  );

  const buildFlipbook = useCallback(async () => {
    const container = bookRef.current;
    if (!container) return;

    const lib = (await import("pdfjs-dist")) as unknown as PdfLib;
    lib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();

    const doc = await lib.getDocument(pdfSrc).promise;
    pdfDocRef.current = doc;

    const total = doc.numPages;
    const pageCount = Math.min(total, MAX_PAGES);
    setTotalPages(pageCount);
    setIsTruncated(total > pageCount);

    const $ = (await import("jquery")).default as JQueryStatic;
    (window as unknown as { $?: JQueryStatic; jQuery?: JQueryStatic }).$ = $;
    (window as unknown as { $?: JQueryStatic; jQuery?: JQueryStatic }).jQuery =
      $;
    await import("turn.js");
    if (!$.fn?.turn) {
      throw new Error("Turn.js failed to initialize.");
    }
    jqueryRef.current = $;

    const host = container.parentElement ?? container;
    const containerWidth = host.clientWidth || 900;

    const firstPage = await doc.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const aspect = firstViewport.height / firstViewport.width;

    const isSingle = containerWidth < 720;
    const maxHeight = Math.round(window.innerHeight * 0.8);
    let bookWidth = Math.min(containerWidth, 1200);
    let pageWidth = isSingle ? bookWidth : bookWidth / 2;
    let bookHeight = Math.round(pageWidth * aspect);

    if (bookHeight > maxHeight) {
      bookHeight = maxHeight;
      pageWidth = Math.round(bookHeight / aspect);
      bookWidth = isSingle ? pageWidth : pageWidth * 2;
    }

    container.innerHTML = "";
    container.style.width = `${bookWidth}px`;
    container.style.height = `${bookHeight}px`;
    setBookHeight(bookHeight);

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const pageWrapper = document.createElement("div");
      pageWrapper.className = "turn-page";

      const canvas = document.createElement("canvas");
      canvas.className = "pdf-canvas";
      pageWrapper.appendChild(canvas);
      container.appendChild(pageWrapper);

      await renderPdfPage(doc, pageNumber, canvas, pageWidth);
    }

    $(container).turn({
      width: bookWidth,
      height: bookHeight,
      autoCenter: true,
      gradients: true,
      acceleration: true,
      display: isSingle ? "single" : "double",
    });

    $(container).on("turned", (...args: unknown[]) => {
      const page = typeof args[1] === "number" ? args[1] : 1;
      setCurrentPage(page);
    });

    setCurrentPage(1);
    setIsLoading(false);
  }, [pdfSrc, renderPdfPage]);

  const rebuildOnResize = useCallback(async () => {
    const doc = pdfDocRef.current;
    const container = bookRef.current;
    const $ = jqueryRef.current;
    if (!doc || !container || !$) return;

    const host = container.parentElement ?? container;
    const containerWidth = host.clientWidth || 900;

    const firstPage = await doc.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const aspect = firstViewport.height / firstViewport.width;

    const isSingle = containerWidth < 720;
    const maxHeight = Math.round(window.innerHeight * 0.8);
    let bookWidth = Math.min(containerWidth, 1200);
    let pageWidth = isSingle ? bookWidth : bookWidth / 2;
    let bookHeight = Math.round(pageWidth * aspect);

    if (bookHeight > maxHeight) {
      bookHeight = maxHeight;
      pageWidth = Math.round(bookHeight / aspect);
      bookWidth = isSingle ? pageWidth : pageWidth * 2;
    }

    container.style.width = `${bookWidth}px`;
    container.style.height = `${bookHeight}px`;
    setBookHeight(bookHeight);

    const canvases = Array.from(container.querySelectorAll("canvas"));
    for (const canvas of canvases) {
      const index = canvases.indexOf(canvas);
      const pageNumber = index + 1;
      await renderPdfPage(doc, pageNumber, canvas, pageWidth);
    }

    $(container).turn("size", bookWidth, bookHeight);
    $(container).turn("display", isSingle ? "single" : "double");
  }, [renderPdfPage]);

  useEffect(() => {
    let cancelled = false;
    const bookNode = bookRef.current;

    buildFlipbook().catch(() => {
      if (!cancelled) setIsLoading(false);
    });

    const handleResize = () => {
      if (resizeRafRef.current) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }
      resizeRafRef.current = window.requestAnimationFrame(() => {
        rebuildOnResize().catch(() => {});
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      if (resizeRafRef.current) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }
      if (jqueryRef.current && bookNode) {
        try {
          jqueryRef.current(bookNode).turn("destroy");
        } catch {
          // noop
        }
      }
    };
  }, [buildFlipbook, rebuildOnResize]);

  return (
    <main className="flipbook-page min-h-screen bg-transparent px-6 py-20 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {isTruncated && (
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">
              Showing first {MAX_PAGES} pages for performance.
            </p>
          </header>
        )}

        <section className="space-y-4">
          <div className="flex min-h-[60vh] items-center justify-center md:hidden">
            <p className="text-center text-base text-foreground/85">
              Please open this page on a desktop computer.
            </p>
          </div>

          <div className="hidden space-y-4 md:block">
            <div className="turn-layout">
              <div
                className="turn-shell mx-auto"
                style={
                  bookHeight
                    ? ({
                        ["--book-height"]: `${bookHeight}px`,
                      } as CSSProperties)
                    : undefined
                }
              >
                <div
                  id="flipbook"
                  ref={bookRef}
                  className={`turn-book ${isLoading ? "opacity-0" : "opacity-100"}`}
                />
                {isLoading && <Loader fixed />}
              </div>

              {!isLoading && (
                <div className="turn-controls">
                  <div className="flex flex-col gap-3">
                    <Button
                      label="Next"
                      variant="background"
                      action={() =>
                        jqueryRef.current &&
                        bookRef.current &&
                        jqueryRef.current(bookRef.current).turn("next")
                      }
                      className={
                        totalPages > 0 && currentPage < totalPages
                          ? ""
                          : "pointer-events-none opacity-40"
                      }
                    />
                    <Button
                      label="Prev"
                      variant="outline"
                      action={() =>
                        jqueryRef.current &&
                        bookRef.current &&
                        jqueryRef.current(bookRef.current).turn("previous")
                      }
                      className={
                        currentPage > 1 ? "" : "pointer-events-none opacity-40"
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    {" "}
                    <a
                      href="https://instagram.com/studio.jkn"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:opacity-80"
                      aria-label="Open Instagram"
                      title="Open Instagram"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"
                          fill="currentColor"
                        />
                        <path
                          d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                    <a
                      href="/okay.pdf"
                      download
                      className="text-white hover:opacity-80"
                      aria-label="Download PDF"
                      title="Download PDF"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="32"
                        />
                        <path
                          d="M176 272l80 80 80-80M256 48v288"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="32"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .flipbook-page {
          position: relative;
          background-color: rgb(0, 0, 255);
          background-image:
            radial-gradient(
              circle at center,
              rgba(10, 10, 10, 0) 0%,
              rgba(10, 10, 10, 0.28) 38%,
              rgb(0, 0, 255) 100%
            ),
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.09) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.09) 1px,
              transparent 1px
            );
          background-repeat: no-repeat, repeat, repeat;
          background-position:
            center,
            top left,
            top left;
          background-size:
            100% 100%,
            56px 56px,
            56px 56px;
        }

        .turn-shell {
          position: relative;
          width: 100%;
          min-height: var(--book-height, auto);
          max-height: 80vh;
          display: flex;
          justify-content: center;
        }

        .turn-book {
          margin: 0 auto;
          position: relative;
          border-radius: 32px;
          max-height: 80vh;
        }

        .turn-layout {
          display: flex;
          align-items: flex-end;
          gap: 16px;
        }

        .turn-controls {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 12px;
          min-height: var(--book-height, auto);
          position: sticky;
          top: 120px;
        }

        .turn-loading {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          text-transform: uppercase;
          color: #ffffff;
          backdrop-filter: blur(6px);
          z-index: 40;
          pointer-events: none;
        }

        .turn-page {
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        }

        .turn-page .pdf-canvas {
          display: block;
          width: 100%;
          height: auto;
          background: #ffffff;
        }
      `}</style>
    </main>
  );
}
