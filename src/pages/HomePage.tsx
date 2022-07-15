import React, { useEffect, useState } from 'react'
import { useLazyGetUserReposQuery, useSearchUsersQuery } from '../store/github/gitHub.api'
import { useDebounce } from '../hooks/debounce'
import { IRepo, IUser } from '../models/models'
import { RepoCard } from '../components/RepoCard'

export const HomePage = () => {
  const [search, setSearch] = useState<string>('vladilenm')
  const [dropDown, setDropDown] = useState<boolean>(false)
  const debounced = useDebounce(search)

  const { isLoading, isError, data } = useSearchUsersQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const [fetchRepos, { isLoading: isReposLoading, data: reposData }] = useLazyGetUserReposQuery()

  // console.table(data)

  useEffect(() => {
    setDropDown(debounced.length > 3 && data?.length! > 0)
  }, [debounced, data])

  const clickHandler = (username: string) => {
    fetchRepos(username)
    // setSearch('')
    setDropDown(false)
  }

  return (
    <div className='flex justify-center pt-10 mx-auto h-screen '>
      {isError && <p className='text-center text-red-600'>Something went wrong...</p>}

      <div className='relative w-[560px] '>
        <input
          type='text'
          className='border py-2 px-4 w-full h-[42px] mb-2'
          placeholder='Search for Github username'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {dropDown && (
          <ul className='list-none absolute top-[42px] left-0 right-0 max-h-[200px] shadow-md bg-white'>
            {isLoading && <p className='text-center'>Loading...</p>}
            {data?.map((user: IUser) => (
              <li
                key={user.id}
                onClick={() => clickHandler(user.login)}
                className='py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer'
              >
                {user.login}
              </li>
            ))}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam at autem
          </ul>
        )}
        <div className='container'>
          {isReposLoading && <p className='text-center'>Repos are loading...</p>}
          {reposData?.map((repo: IRepo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  )
}
