/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client.exercise'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner} from './components/lib'
import * as colors from './styles/colors'

async function getUser() {
  let user = null
  const token = await auth.getToken()
  if (token) {
    user = await client('me', {token}).then(data => data.user)
  }
  return user
}

function App() {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    isIdle,
    setData,
    error,
    run,
    setError,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const logout = () => {
    auth.logout()
    setData(null)
  }

  const login = ({username, password}) => {
    return auth.login({username, password}).then(user => setData(user))
  }

  const register = ({username, password}) => {
    return auth.register({username, password}).then(user => setData(user))
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isSuccess) {
    return data ? (
      <AuthenticatedApp user={data} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
