import './App.css';
import Result from './Result';
import React,{useState,useMemo,useEffect} from 'react';
const synth=window.speechSynthesis

function App() {
  const voices=useMemo(()=> synth.getVoices(),[] )
  const [voiceSelected,setVoiceSelected]=useState('Google US English')
  const [text,setText]=useState('')
  const [isSpeaking,setIsSpeaking]=useState('')
  const [meanings,setMeanings]=useState([])
  const [phonetics,setPhonetics]=useState([])
  const [word,setWord]=useState("")
  const [error,setError]=useState("")

  // handling different words from api start
  const dictionaryApi=(text)=>{
    let url=`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
    fetch(url)
      .then(res=>res.json())
      .then(result=>{
        console.log(result)
        setMeanings(result[0].meanings)
        setPhonetics(result[0].phonetics)
        setWord(result[0].word)
        setError('')
      })
      .catch(err=>setError(err))
  }

  // for reset 
  const reset=()=>{
    setIsSpeaking("")
    setError("")
    setMeanings([])
    setPhonetics([])
    setWord("")
  }

  useEffect(()=>{
    if(!text.trim())  return reset
    const debounce = setTimeout(()=>{
      dictionaryApi(text)
    },200)
    return ()=> clearTimeout(debounce)
  },[text])
  // handling different words from api end


  // handling speech start
  const startSpeech=(text)=>{
    const utterance=new SpeechSynthesisUtterance(text)
    // setting language for speak
    const Voice=voices.find(voice=>voice.name===voiceSelected)
    utterance.voice=Voice
    synth.speak(utterance)
  }

  const handleSpeech=()=>{
    if(!text.trim())  return
    if(!synth.speaking){  //will not repeat while speaking
      startSpeech(text)
      setIsSpeaking("speak")
    }else{
      synth.cancel()
    }

    setInterval(()=>{
      if(!synth.speaking){
        setIsSpeaking("")
      }
    },100)
  }

  // handling speech end
  
  return (
    <>
      <div className="con">
        <h1>English Dictionary</h1>
        <form action="">
          <div className="row">
            <textarea 
              cols="30" rows="4" 
              placeholder='Enter Word to Search'
              value={text}
              onChange={e=>setText(e.target.value)}
            />

            {/* setting voice language start */}
            <div className="voice-icons">
              <div className="select-voice">
                <select value={voiceSelected}
                  onChange={e=>setVoiceSelected(e.target.value)}
                >
                {
                  voices.map(voice=>(
                    <option key={voice.name} value={voice.name}>{voice.name}</option>
                  ))
                }
                </select> 
              </div>

            {/* setting voice language end */}

              {/* speech icon */}
              <i className={`fa-solid fa-volume-high ${isSpeaking}`} 
                onClick={handleSpeech}                    
              />
            </div>
          </div>
        </form>

        {
          (text.trim() !== "" && !error) &&
          <Result
            word={word}
            phonetics={phonetics}
            meanings={meanings}
            setText={setText}
          />
        }

      </div>
    </>
  );
}

export default App;
