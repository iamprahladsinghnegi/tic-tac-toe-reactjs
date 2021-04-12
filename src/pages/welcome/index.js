import React from 'react';
import CustomButton from '../../component/button';
import CustomCard from '../../component/card';
import './index.scss';


export const Welcome = ({ history }) => {

    const handleNext = (mode) => {
        history.push(`/start?mode=${mode}`);
    }

    return (
        <div className="welcome">
            <CustomCard>
                <div>
                    <h1>Welcome to Tic-Tac-Toe</h1>
                </div>
                <div>
                    <CustomButton type={'primary'} param={"new"} handleClick={handleNext} text="Start New Match" />
                    <CustomButton type={'secondary'} param={"join"} handleClick={handleNext} text="Join Match" />
                </div>
            </CustomCard>
        </div>
    );
};

