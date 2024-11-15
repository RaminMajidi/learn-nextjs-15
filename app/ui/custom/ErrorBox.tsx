import React, { FC } from 'react'

type Props = {
    id: string,
    stateError: string[] | undefined,
}

const ErrorBox: FC<Props> = ({ id, stateError }) => {
    return (
        <div id={`${id}`} aria-live="polite" aria-atomic="true">
            {stateError &&
                stateError.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
        </div>
    )
}

export default ErrorBox