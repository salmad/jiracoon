import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import { Trash2, Sparkles } from 'lucide-react'

const IntroAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('pain') // pain, crumple, dispose, solution, complete
  const [painStep, setPainStep] = useState(0) // 0-3 for each pain point step
  const [timeWasted, setTimeWasted] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [isCrumpling, setIsCrumpling] = useState(false)
  const chartRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Google Sheets Pain Animation Timeline
    // Step 0: Initial state (0.5s)
    const step0Timer = setTimeout(() => setPainStep(1), 500)

    // Step 1: Fight with the UI (2s)
    const step1Timer = setTimeout(() => setPainStep(2), 2500)

    // Step 2: Manually format (2s)
    const step2Timer = setTimeout(() => setPainStep(3), 4500)

    // Step 3: Still ugly finale (2.5s) then crumple
    const step3Timer = setTimeout(() => {
      setPainStep(3)
      // Start crumple animation
      setTimeout(() => {
        setIsCrumpling(true)
        // After crumple completes, move to dispose stage
        setTimeout(() => setStage('dispose'), 1500)
      }, 2500)
    }, 6500)

    return () => {
      clearTimeout(step0Timer)
      clearTimeout(step1Timer)
      clearTimeout(step2Timer)
      clearTimeout(step3Timer)
    }
  }, [])

  // Time wasted counter
  useEffect(() => {
    if (stage === 'pain') {
      const interval = setInterval(() => {
        setTimeWasted(prev => Math.min(prev + 1, 163)) // 2h 43min = 163 minutes
      }, 50) // Speeds up the counter
      return () => clearInterval(interval)
    }
  }, [stage])

  // Click counter
  useEffect(() => {
    if (stage === 'pain' && (painStep === 1 || painStep === 2)) {
      const interval = setInterval(() => {
        setClickCount(prev => Math.min(prev + 1, 47))
      }, 80)
      return () => clearInterval(interval)
    }
  }, [stage, painStep])


  const handleDisposeComplete = () => {
    setTimeout(() => {
      setStage('solution')
    }, 500)
  }

  const handleSolutionComplete = () => {
    // After chat slides away, call onComplete
    setTimeout(onComplete, 500)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[700px] flex items-center justify-center overflow-visible bg-gradient-to-br from-slate-50 to-slate-100"
    >
      {/* Google Sheets Pain Workflow - visible during pain stage */}
      {stage === 'pain' && (
        <div className="absolute inset-0 flex items-center justify-center px-8">
          {/* Split Screen Container */}
          <div className={`relative w-full max-w-6xl ${isCrumpling ? 'animate-crumple' : ''}`}>
            {/* Time Wasted Counter - Top Center */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg animate-pulse">
                ⏱️ Time wasted: {Math.floor(timeWasted / 60)}h {timeWasted % 60}m
              </div>
            </div>

            {/* Complexity Badge - Bottom Center */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl font-semibold">
                Complexity: <span className="text-yellow-400">{clickCount} clicks</span>, <span className="text-red-400">endless menus</span>, <span className="text-blue-400">0 fun</span>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div className={`flex gap-6 p-6 rounded-2xl border-4 transition-all duration-500 ${
              painStep >= 3 ? 'border-red-600 animate-pulse-border' : 'border-red-400'
            }`} style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))'
            }}>

              {/* LEFT: Google Sheets Interface Mockup */}
              <div className="flex-1 bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Google Sheets Header */}
                <div className="bg-[#f9fbfd] border-b border-slate-200 p-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Google Sheets - Untitled spreadsheet</div>
                </div>

                {/* Toolbar - animated clicking */}
                <div className="bg-[#fafafa] border-b border-slate-200 p-2 flex gap-1 items-center relative">
                  {painStep === 1 && (
                    <>
                      {/* Animated cursor clicking through menus */}
                      <div className="absolute top-2 left-4 w-4 h-4 animate-ping">
                        <div className="w-4 h-4 bg-red-500 rounded-full opacity-75"></div>
                      </div>
                    </>
                  )}
                  <div className="text-xs px-2 py-1 hover:bg-slate-100 rounded cursor-pointer">File</div>
                  <div className="text-xs px-2 py-1 hover:bg-slate-100 rounded cursor-pointer">Edit</div>
                  <div className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${painStep === 1 ? 'bg-blue-100 animate-pulse' : 'hover:bg-slate-100'}`}>Insert</div>
                  <div className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${painStep === 2 ? 'bg-blue-100 animate-pulse' : 'hover:bg-slate-100'}`}>Format</div>
                  <div className="text-xs px-2 py-1 hover:bg-slate-100 rounded cursor-pointer">Data</div>
                  <div className="text-xs px-2 py-1 hover:bg-slate-100 rounded cursor-pointer">Tools</div>
                </div>

                {/* Formatting toolbar - Step 2 animation */}
                {painStep === 2 && (
                  <div className="bg-white border-b border-slate-200 p-2 flex gap-2 items-center animate-in slide-in-from-top duration-300">
                    <div className="w-6 h-6 bg-purple-200 rounded animate-pulse"></div>
                    <div className="w-6 h-6 bg-blue-200 rounded animate-pulse" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-6 h-6 bg-green-200 rounded animate-pulse" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-6 h-6 bg-yellow-200 rounded animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-6 h-6 bg-red-200 rounded animate-pulse" style={{ animationDelay: '400ms' }}></div>
                    <div className="text-xs text-slate-500 ml-2 animate-pulse">Font... Size... Color... Border...</div>
                  </div>
                )}

                {/* Chart preview area */}
                <div className="p-4 relative" ref={chartRef}>
                  {/* Ugly chart image */}
                  <div className={`relative transition-all duration-500 ${
                    painStep >= 3 ? 'opacity-100' : 'opacity-60'
                  }`}>
                    {/* X marks for Step 3 */}
                    {painStep >= 3 && (
                      <>
                        <div className="absolute top-4 right-4 text-6xl text-red-600 animate-in zoom-in duration-300 font-bold">✗</div>
                        <div className="absolute bottom-4 left-4 text-6xl text-red-600 animate-in zoom-in duration-300 font-bold" style={{ animationDelay: '150ms' }}>✗</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-red-600 animate-in zoom-in duration-500 font-bold opacity-50" style={{ animationDelay: '300ms' }}>✗</div>
                      </>
                    )}
                    <img
                      src="/ugly_gsheet.png"
                      alt="Ugly Google Sheets Chart"
                      className="w-full h-auto rounded border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: Pain Points Bubbles */}
              <div className="w-80 flex flex-col justify-center gap-6">
                {/* Step 1: Fight with UI */}
                {painStep >= 1 && (
                  <div className="animate-in fade-in slide-in-from-right duration-500">
                    <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl animate-bounce">😫</div>
                        <div>
                          <div className="font-bold text-slate-800">Step 1: Fight with the UI</div>
                          <div className="text-sm text-slate-600 mt-1">Navigate through 5+ menus to insert a chart...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Format Everything */}
                {painStep >= 2 && (
                  <div className="animate-in fade-in slide-in-from-right duration-500" style={{ animationDelay: '200ms' }}>
                    <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl animate-bounce">😤</div>
                        <div>
                          <div className="font-bold text-slate-800">Step 2: Manually format EVERYTHING</div>
                          <div className="text-sm text-slate-600 mt-1">Colors, fonts, sizes, borders... one by one...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Still Ugly */}
                {painStep >= 3 && (
                  <div className="animate-in fade-in slide-in-from-right duration-500" style={{ animationDelay: '200ms' }}>
                    <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-start gap-3">
                        <div className="flex gap-1 text-3xl">
                          <span>🤦</span>
                          <span>🤦‍♂️</span>
                          <span>🤦‍♀️</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Step 3: Still looks ugly</div>
                          <div className="text-sm text-slate-600 mt-1">After all that work... this is the result?!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispose Stage */}
      {stage === 'dispose' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <TrashBinAnimation onComplete={handleDisposeComplete} />
        </div>
      )}

      {/* Solution Stage - Chat Console */}
      {stage === 'solution' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SolutionAnimation onComplete={handleSolutionComplete} />
        </div>
      )}
    </div>
  )
}

const TrashBinAnimation = ({ onComplete }) => {
  const [crumpledBallVisible, setCrumpledBallVisible] = useState(true)
  const [isLidOpen, setIsLidOpen] = useState(false)
  const [ballFlying, setBallFlying] = useState(false)
  const [showDust, setShowDust] = useState(false)
  const [binShake, setBinShake] = useState(false)
  const [binDisappear, setBinDisappear] = useState(false)
  const [message, setMessage] = useState('') // '', 'riddance', 'better-way'

  useEffect(() => {
    // Timeline:
    // 0ms: Crumpled ball appears at top, lid opens
    setTimeout(() => {
      setIsLidOpen(true)
    }, 100)

    // 400ms: Ball starts flying toward bin
    setTimeout(() => {
      setBallFlying(true)
    }, 400)

    // 1200ms: Ball reaches bin, create dust burst, shake bin, hide ball
    setTimeout(() => {
      setCrumpledBallVisible(false)
      setShowDust(true)
      setBinShake(true)
    }, 1200)

    // 1500ms: Close lid
    setTimeout(() => {
      setIsLidOpen(false)
    }, 1500)

    // 1800ms: Show "Good riddance!" message
    setTimeout(() => {
      setMessage('riddance')
    }, 1800)

    // 2600ms: Transition to "There IS a better way..."
    setTimeout(() => {
      setMessage('better-way')
    }, 2600)

    // 3400ms: Start bin disappear animation
    setTimeout(() => {
      setBinDisappear(true)
    }, 3400)

    // 4400ms: Complete
    setTimeout(() => {
      onComplete()
    }, 4400)
  }, [onComplete])

  return (
    <div className="relative flex flex-col items-center">
      {/* Crumpled paper ball */}
      {crumpledBallVisible && (
        <div className={`absolute top-0 w-20 h-20 ${ballFlying ? 'animate-crumple-ball-fly' : ''}`}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 shadow-2xl relative overflow-hidden">
            {/* Crumple texture lines */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-2 left-3 w-8 h-0.5 bg-slate-600 rotate-45"></div>
              <div className="absolute top-6 right-2 w-6 h-0.5 bg-slate-600 -rotate-12"></div>
              <div className="absolute bottom-4 left-2 w-10 h-0.5 bg-slate-600 rotate-12"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-slate-700 -rotate-45"></div>
            </div>
          </div>
        </div>
      )}

      {/* Trash Bin */}
      <div className={`relative transition-all duration-1000 ${
        binDisappear ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100'
      } ${binShake ? 'animate-bin-shake' : ''}`}>
        {/* Dust burst effect */}
        {showDust && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-slate-400/40 animate-dust-burst"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-slate-300/30 animate-dust-burst" style={{ animationDelay: '100ms' }}></div>
          </>
        )}

        {/* Trash bin body */}
        <div className="relative w-32 h-40 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg shadow-2xl border-4 border-slate-600">
          {/* Trash bin opening */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900/50 rounded-t-lg overflow-hidden"></div>

          {/* Trash bin ridges */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-600"></div>
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-slate-600"></div>
          <div className="absolute top-28 left-0 right-0 h-0.5 bg-slate-600"></div>
        </div>

        {/* Trash bin lid */}
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-6 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg shadow-xl border-2 border-slate-500 transition-all duration-500 origin-left ${
            isLidOpen ? '-rotate-60 -translate-y-6 translate-x-4' : 'rotate-0'
          }`}
        >
          {/* Lid handle */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-800 rounded-full"></div>
        </div>

        {/* Trash icon on bin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Trash2 className="w-12 h-12 text-slate-400/30" />
        </div>
      </div>

      {/* Messages */}
      <div className="mt-16 h-20 flex items-center justify-center">
        {message === 'riddance' && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Good riddance! 🎉
            </div>
          </div>
        )}
        {message === 'better-way' && (
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center">
              There IS a better way...
            </div>
          </div>
        )}
      </div>

      {/* Scorch mark left behind after bin disappears */}
      {binDisappear && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in fade-in duration-500">
          <div className="w-40 h-4 rounded-full bg-slate-800/20 blur-sm"></div>
        </div>
      )}
    </div>
  )
}

const SolutionAnimation = ({ onComplete }) => {
  const [showHeading, setShowHeading] = useState(false)
  const [chatPosition, setChatPosition] = useState('right') // right, racing, braking, center, button-press, loading, slide-out
  const [typedText, setTypedText] = useState('')
  const [buttonState, setButtonState] = useState('idle') // idle, pressing, loading
  const fullText = "can you plot US GDP by year and highlight covid period"

  useEffect(() => {
    // Step 1: Show heading (1s)
    setTimeout(() => setShowHeading(true), 300)

    // Step 2: Racing car enters from right (fast)
    setTimeout(() => setChatPosition('racing'), 1500)

    // Step 3: Braking/wiggling effect
    setTimeout(() => setChatPosition('braking'), 2200)

    // Step 4: Finally settle at center
    setTimeout(() => setChatPosition('center'), 2600)

    // Step 5: Start typing after chat settles (3s)
    setTimeout(() => {
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          // Step 6: Animate button press after typing (wait 500ms)
          setTimeout(() => {
            setButtonState('pressing')
            // Step 7: Show loading state
            setTimeout(() => {
              setButtonState('loading')
              // Step 8: Slide out after loading (1.5s)
              setTimeout(() => {
                setChatPosition('slide-out')
                // Complete after slide out animation (1s)
                setTimeout(onComplete, 1000)
              }, 1500)
            }, 300)
          }, 500)
        }
      }, 50) // 50ms per character for typing effect
    }, 3000)
  }, [onComplete, fullText])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* "There is a better way..." heading */}
      <div
        className={`mb-16 transition-all duration-1000 ${
          showHeading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center">
          There is a better way...
        </h2>
      </div>

      {/* Chat Console */}
      <div
        className={`${
          chatPosition === 'right'
            ? 'translate-x-[1000px] opacity-0'
            : chatPosition === 'racing'
            ? 'translate-x-0 opacity-100 transition-all duration-700 ease-in'
            : chatPosition === 'braking'
            ? 'translate-x-0 opacity-100 animate-wiggle'
            : chatPosition === 'center'
            ? 'translate-x-0 opacity-100 transition-all duration-300 ease-out'
            : chatPosition === 'slide-out'
            ? 'translate-x-[1000px] opacity-0 transition-all duration-1000 ease-in'
            : 'translate-x-0 opacity-100'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-premium-lg border-2 border-primary/20 p-6 w-[600px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Jiracoon AI</div>
              <div className="text-xs text-slate-500">Your chart assistant</div>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-sm text-slate-700 font-mono">
                  {typedText}
                  {typedText.length < fullText.length && (
                    <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse"></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="mt-4 flex justify-end">
            <button
              className={`px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 ${
                buttonState === 'pressing'
                  ? 'scale-95 shadow-md'
                  : buttonState === 'loading'
                  ? 'scale-100 shadow-xl cursor-wait'
                  : 'scale-100'
              }`}
              disabled={buttonState !== 'idle'}
            >
              {buttonState === 'loading' && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {buttonState === 'loading' ? 'Generating...' : 'Generate Chart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroAnimation
