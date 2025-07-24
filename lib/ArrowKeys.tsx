import DownArrow from '@/assets/keys/down.svg'
import LeftArrow from '@/assets/keys/left.svg'
import RightArrow from '@/assets/keys/right.svg'
import UpArrow from '@/assets/keys/up.svg'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { MessagePayload } from './utils'
import { useModifiers } from '@/context/ModifierContext'
import { handleKeyPress } from './handleKeyPress'

const ArrowKeys = ({ sendMessage }: { sendMessage: (message: MessagePayload) => void }) => {
  const modifierContext = useModifiers();

  return (
    <View className='flex-row flex-1 items-end gap-1.5'>
      <TouchableOpacity onPress={() => handleKeyPress("left", false, sendMessage, modifierContext)} className='flex-1 h-6 rounded-md bg-neutral-800 justify-center items-center'>
        <LeftArrow width={7} height={7} />
      </TouchableOpacity>
      <View className='flex-1 h-14 justify-between'>
        <TouchableOpacity onPress={() => handleKeyPress("up", false, sendMessage, modifierContext)} className='h-[23px] rounded-t-md bg-neutral-800 justify-center items-center'>
          <UpArrow width={7} height={7} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleKeyPress("down", false, sendMessage, modifierContext)} className='h-[23px] rounded-b-md bg-neutral-800 justify-center items-center'>
          <DownArrow width={7} height={7} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleKeyPress("right", false, sendMessage, modifierContext)} className='flex-1 h-6 rounded-md bg-neutral-800 justify-center items-center'>
        <RightArrow width={7} height={7} /> 
      </TouchableOpacity>
    </View>
  )
}

export default ArrowKeys