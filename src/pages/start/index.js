import React from 'react';
import queryString from 'query-string';
import './index.scss';
import CustomButton from '../../component/button';
import CustomCard from '../../component/card';

export const Start = ({ history, location }) => {
    const { mode } = queryString.parse(location.search);
    const [roomId, setRoomId] = React.useState('');
    const inputRef = React.useRef(null);
    const [inputError, setInputError] = React.useState('');

    const handleNext = (type = 'multiPlayer') => {
        let queryParams = `type=${type}`
        if (mode === 'join') {
            if (roomId === '') {
                setInputError('Please Enter Match Id!')
                inputRef.current.focus();
                return
            }
            queryParams += `&roomId=${roomId}`;
        }
        history.push(`/game?${queryParams}`);
    }


    return (
        <div className="start">
            <CustomCard>
                <h1>
                    {mode === 'new' ? 'Select Option' : 'Join Match'}
                </h1>
                {mode === 'new' ?
                    <CustomButton type={'primary'} param={"multiPlayer"} handleClick={handleNext} text="2 Players" />
                    :
                    <>
                        <input
                            ref={inputRef}
                            required
                            placeholder="Enter Match Id "
                            onChange={(event) => { setRoomId(event.target.value); setInputError('') }}
                        />
                        {inputError && <p>{inputError}</p>}
                    </>
                }
                <CustomButton type={'secondary'} param={mode === 'new' ? "singlePlayer" : "multiPlayer"} handleClick={handleNext} text={mode === 'new' ? "BOT" : "Join"} />
            </CustomCard>
        </div>
    );
};

