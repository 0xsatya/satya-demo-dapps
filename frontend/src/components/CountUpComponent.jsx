import React from 'react'
import CountUp from 'react-countup'
import * as Utils from "../utilities/utils";


function CountUpComponent({endNumber, currencyUnit='', prefix=''}) {
    return (
        <div>
            <CountUp
                  start={0}
                  end={Number(endNumber)}
                  delay={0}
                  duration={Utils.countUpDuration}
                  decimals={Utils.getNumberOfDecimals(endNumber)}
                  useEasing={true}
                  suffix={" " + currencyUnit}
                  prefix={prefix}
                  // onEnd={() => console.log("Ended!", this)}
                  // onStart={() => console.log("Started!", this)}
                >
                  {({ countUpRef }) => (
                    <div>
                      <span ref={countUpRef} />
                    </div>
                  )}
                </CountUp>
        </div>
    )
}

export default CountUpComponent
