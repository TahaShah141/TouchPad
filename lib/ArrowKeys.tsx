import DownArrow from '@/assets/keys/down.svg'
import LeftArrow from '@/assets/keys/left.svg'
import RightArrow from '@/assets/keys/right.svg'
import UpArrow from '@/assets/keys/up.svg'
import React from 'react'
import { View } from 'react-native'

const ArrowKeys = () => {
  return (
    <View className='flex-row flex-1 items-end gap-1.5'>
      <View className='flex-1 h-6 rounded-md bg-neutral-800 justify-center items-center'>
        <LeftArrow width={7} height={7} />
      </View>
      <View className='flex-1 h-14 justify-between'>
        <View className='h-[23px] rounded-t-md bg-neutral-800 justify-center items-center'>
          <UpArrow width={7} height={7} />
        </View>
        <View className='h-[23px] rounded-b-md bg-neutral-800 justify-center items-center'>
          <DownArrow width={7} height={7} />
        </View>
      </View>
      <View className='flex-1 h-6 rounded-md bg-neutral-800 justify-center items-center'>
        <RightArrow width={7} height={7} /> 
      </View>
    </View>
  )
}

export default ArrowKeys