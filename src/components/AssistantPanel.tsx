import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { sendMessage, SUGGESTED_PROMPTS, type AssistantMessage } from '../lib/assistant';

export default function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (text: string) => {
    if (!text.trim() || sending) return;
    const next: AssistantMessage[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(next);
    setInput('');
    setSending(true);

    const { reply } = await sendMessage(next);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setSending(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open homework assistant"
        className="fixed bottom-6 right-6 z-40 w-[52px] h-[52px] rounded-full bg-white text-black shadow-lg shadow-black/30 flex items-center justify-center hover:bg-white/90 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              // Fixed, right-anchored, sitting above the trigger button on
              // every screen size (bottom-24 clears the 52px button at
              // bottom-6 with room to spare): no separate mobile layout
              // that anchors differently, since that's what broke this
              // before.
              //
              // Deliberately NOT combining `fixed` with `liquid-glass` on
              // this same element: .liquid-glass (index.css) sets its own
              // `position: relative` for its pseudo-element border effect,
              // and at equal CSS specificity that silently won over
              // Tailwind's `fixed` utility depending on stylesheet order —
              // the panel was rendering in normal document flow (thousands
              // of pixels down the page on this long a page) instead of
              // actually being fixed to the viewport. That's the real bug
              // behind both "wrong position" and "doesn't seem to work" —
              // it was never fixed-positioned at all. Splitting positioning
              // (this div) from the liquid-glass visual treatment (the div
              // inside it) means they can never collide again.
              className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[65vh] sm:h-[560px]"
              role="dialog"
              aria-label="AI homework assistant"
            >
              <div className="w-full h-full rounded-2xl liquid-glass flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-300" />
                    <p className="text-white text-sm font-normal">Homework Assistant</p>
                  </div>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                  {messages.length === 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-light leading-relaxed mb-4">
                        Ask about how AI works, or get help thinking through homework. This assistant explains and
                        coaches. It won’t write your assignment for you.
                      </p>
                      <div className="flex flex-col gap-2">
                        {SUGGESTED_PROMPTS.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => submit(prompt)}
                            className="text-left text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2.5 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm font-light leading-relaxed ${
                        m.role === 'user' ? 'self-end bg-white text-black' : 'self-start bg-white/8 text-white/80'
                      }`}
                    >
                      {m.content}
                    </div>
                  ))}

                  {sending && (
                    <div className="self-start flex items-center gap-2 text-white/40 text-xs px-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Thinking...
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit(input);
                  }}
                  className="flex items-center gap-2 px-4 py-3 border-t border-white/10 shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/40"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    aria-label="Send"
                    className="w-9 h-9 shrink-0 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-40 hover:bg-white/90 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
