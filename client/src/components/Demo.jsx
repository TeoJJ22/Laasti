import React from 'react'
import { useState } from 'react'
const Demo = () => {
  const [prompt, setPrompt] = useState({
    question: '',
    answer: '',
  })
  const [isFetching, setIsFetching] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true)      //Fetching is true while waiting for response
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: prompt.question }),
      });
  
      const data = await response.json();
      console.log('Response data:', data)

      setPrompt({ ...prompt, answer: data.data });
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsFetching(false) //Fetching back to false once ready
    }
  }

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form 
          className="relative flex justify-center items-center" 
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Kuvaile käyttötarkoitus"
            value={prompt.question}
            onChange={(e) => setPrompt({ ...
              prompt, question: e.target.value 
            })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
        
        <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
            <p>Odota Hetki</p>
          ) : (
            prompt.answer && (
              <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                  Etsimäsi <span 
                  className="blue_gradient">Laasti</span>
                </h2>
                <div className="summary_box">
                  <p>{prompt.answer}</p>
                </div>
              </div>
            )
          )}
        </div>
        
      </div>
    </section>
  )
}

export default Demo