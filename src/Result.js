import React from "react";

const Result = ({ word, setText, meanings, phonetics }) => {
  return (
    <>
      <ul>
        <li className="word">
          <h2>{word}</h2>
          {phonetics.map((phonetic, index) => (
            <span key={index}>{phonetic.text}</span>
          ))}
        </li>
        
        {
          meanings.map((meaning,index)=>(
          <li className="contain">
            <h3>Noun</h3>
            <div className="details meanings">
              <h3>Meanings</h3>
              {
                meaning.definitions.map((definition,index)=>(
                  <p key={index}>- {definition.definition}</p>
                ))
              }
            </div>
            {
              meaning.synonyms.length !==0 &&
              <div className="details synonyms">
                <h3>Synonyms</h3>
                {
                  meaning.synonyms.map((synonym,index)=>(
                      <span key={index}
                        onClick={()=>setText(synonym)}
                      >{`${synonym},`}
                      </span>
                  ))
                }
              </div>
            }
          </li>
          ))
        }

      </ul>
    </>
  );
};

export default Result;
