import { Text, View } from "react-native";

import Command from '@/assets/keys/command.svg';
import Control from '@/assets/keys/control.svg';
import f1 from '@/assets/keys/f1.svg';
import f10 from '@/assets/keys/f10.svg';
import f11 from '@/assets/keys/f11.svg';
import f12 from '@/assets/keys/f12.svg';
import f2 from '@/assets/keys/f2.svg';
import f3 from '@/assets/keys/f3.svg';
import f4 from '@/assets/keys/f4.svg';
import f5 from '@/assets/keys/f5.svg';
import f6 from '@/assets/keys/f6.svg';
import f7 from '@/assets/keys/f7.svg';
import f8 from '@/assets/keys/f8.svg';
import f9 from '@/assets/keys/f9.svg';
import Globe from '@/assets/keys/globe.svg';
import Option from '@/assets/keys/option.svg';
import { SvgProps } from "react-native-svg";

const functionKey = (key: string, SVG: React.FC<SvgProps>) => {
  return (
    <View className="justify-between h-full pt-3 pb-1 items-center">
      <SVG width={12} height={12} />
      <Text className="text-white uppercase text-sm">{key}</Text> 
    </View>
  )
}

const functionKeys = [
  { display: functionKey("f1", f1), keyCode: "lights_mon_down" },
  { display: functionKey("f2", f2), keyCode: "lights_mon_up" },
  { display: functionKey("f3", f3), keyCode: "f3" },
  { display: functionKey("f4", f4), keyCode: "f4" },
  { display: functionKey("f5", f5), keyCode: "f5" },
  { display: functionKey("f6", f6), keyCode: "f6" },
  { display: functionKey("f7", f7), keyCode: "audio_prev" },
  { display: functionKey("f8", f8), keyCode: "audio_pause" },
  { display: functionKey("f9", f9), keyCode: "audio_next" },
  { display: functionKey("f10", f10), keyCode: "audio_mute" },
  { display: functionKey("f11", f11), keyCode: "audio_vol_down" },
  { display: functionKey("f12", f12), keyCode: "audio_vol_up" },
];

const stackedKey = (symbols: [string, string]) => {
  return (
    <View className="justify-between h-full py-1 items-center">
      <Text className="text-white uppercase text-lg">{symbols[0]}</Text> 
      <Text className="text-white uppercase text-lg">{symbols[1]}</Text> 
    </View>
  )
}

const alphabetKey = (letter: string) => {
  return (
    <View className="h-full justify-center items-center py-2">
      <Text className="text-white uppercase text-lg">{letter}</Text> 
    </View>
  )
}

export type KeyType = {
  width?: number
  display: React.ReactNode | string
  keyCode: string
  isModifier?: boolean
}

export const KEYS: KeyType[][] = [
  [
    {
      width: 1.5,
      keyCode: "escape",
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">esc</Text>
        </View>
      )
    },
    ...functionKeys,
    {
      keyCode: "power",
      display: (
        <View className="py-2">
          <View className="rounded-[100%] size-full bg-[#212121]">

          </View>
        </View>
      )
    }
  ],
  [
    {
      keyCode: "`",
      display: stackedKey(['~', '`'])
    },
    {
      keyCode: "1",
      display: stackedKey(['!', '1'])
    },
    {
      keyCode: "2",
      display: stackedKey(['@', '2'])
    },
    {
      keyCode: "3",
      display: stackedKey(['#', '3'])
    },
    {
      keyCode: "4",
      display: stackedKey(['$', '4'])
    },
    {
      keyCode: "5",
      display: stackedKey(['%', '5'])
    },
    {
      keyCode: "6",
      display: stackedKey(['^', '6'])
    },
    {
      keyCode: "7",
      display: stackedKey(['&', '7'])
    },
    {
      keyCode: "8",
      display: stackedKey(['*', '8'])
    },
    {
      keyCode: "9",
      display: stackedKey(['(', '9'])
    },
    {
      keyCode: "0",
      display: stackedKey([')', '0'])
    },
    {
      keyCode: "-",
      display: stackedKey(['_', '-'])
    },
    {
      keyCode: "=",
      display: stackedKey(['+', '='])
    },
    {
      width: 1.5,
      keyCode: "backspace",
      display: (
        <View className="size-full justify-end items-end">
          <Text className="text-white text-lg pb-0.5">delete</Text>
        </View>
      )
    },
  ],
  [
    {
      width: 1.5,
      keyCode: "tab",
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">tab</Text>
        </View>
      )
    },
    {
      keyCode: "q",
      display: alphabetKey("Q")
    },
    {
      keyCode: "w",
      display: alphabetKey("W")
    },
    {
      keyCode: "e",
      display: alphabetKey("E")
    },
    {
      keyCode: "r",
      display: alphabetKey("R")
    },
    {
      keyCode: "t",
      display: alphabetKey("T")
    },
    {
      keyCode: "y",
      display: alphabetKey("Y")
    },
    {
      keyCode: "u",
      display: alphabetKey("U")
    },
    {
      keyCode: "i",
      display: alphabetKey("I")
    },
    {
      keyCode: "o",
      display: alphabetKey("O")
    },
    {
      keyCode: "p",
      display: alphabetKey("P")
    },
    {
      keyCode: "[",
      display: stackedKey(['{', '['])
    },
    {
      keyCode: "]",
      display: stackedKey(['}', ']'])
    },
    {
      keyCode: "\\",
      display: stackedKey(['|', '\\'])
    }
  ],
  [
    {
      width: 1.8,
      keyCode: "capslock",
      isModifier: true,
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">caps lock</Text>
        </View>
      )
    },
    {
      keyCode: "a",
      display: alphabetKey("A")
    },
    {
      keyCode: "s",
      display: alphabetKey("S")
    },
    {
      keyCode: "d",
      display: alphabetKey("D")
    },
    {
      keyCode: "f",
      display: alphabetKey("F")
    },
    {
      keyCode: "g",
      display: alphabetKey("G")
    },
    {
      keyCode: "h",
      display: alphabetKey("H")
    },
    {
      keyCode: "j",
      display: alphabetKey("J")
    },
    {
      keyCode: "k",
      display: alphabetKey("K")
    },
    {
      keyCode: "l",
      display: alphabetKey("L")
    },
    {
      keyCode: ";",
      display: stackedKey([':', ';'])
    },
    {
      keyCode: "'",
      display: stackedKey(['"', "'"])
    },
    {
      width: 1.8,
      keyCode: "enter",
      display: (
        <View className="size-full justify-end items-end">
          <Text className="text-white text-lg pb-0.5">return</Text>
        </View>
      )
    },
  ],
  [
    {
      width: 2.35,
      keyCode: "shift",
      isModifier: true,
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">shift</Text>
        </View>
      )
    },
    {
      keyCode: "z",
      display: alphabetKey("Z")
    },
    {
      keyCode: "x",
      display: alphabetKey("X")
    },
    {
      keyCode: "c",
      display: alphabetKey("C")
    },
    {
      keyCode: "v",
      display: alphabetKey("V")
    },
    {
      keyCode: "b",
      display: alphabetKey("B")
    },
    {
      keyCode: "n",
      display: alphabetKey("N")
    },
    {
      keyCode: "m",
      display: alphabetKey("M")
    },
    {
      keyCode: ",",
      display: stackedKey(['<', ','])
    },
    {
      keyCode: ".",
      display: stackedKey(['>', '.'])
    },
    {
      keyCode: "/",
      display: stackedKey(['?', '/'])
    },
    {
      width: 2.35,
      keyCode: "shift",
      isModifier: true,
      display: (
        <View className="size-full justify-end items-end">
          <Text className="text-white text-lg pb-0.5">shift</Text>
        </View>
      )
    },
  ],
  [
    {
      keyCode: "fn",
      isModifier: true,
      display: (
        <View className="justify-between h-full py-1 pb-2">
          <Text className="text-white text-sm text-right">fn</Text> 
          <Globe width={10} height={10} />
        </View>
      )
    },
    {
      keyCode: "control",
      isModifier: true,
      display: (
        <View className="justify-between h-full py-1 pt-2 items-end">
          <Control width={10} height={10} />
          <Text className="text-white text-sm text-center">control</Text> 
        </View>
      )
    },
    {
      keyCode: "alt",
      isModifier: true,
      display: (
        <View className="justify-between h-full py-1 pt-2 items-end">
          <Option width={10} height={10} />
          <Text className="text-white text-sm text-center">option</Text> 
        </View>
      )
    },
    {
      width: 1.235,
      keyCode: "command",
      isModifier: true,
      display: (
        <View className="justify-between h-full py-1 pt-2 items-end">
          <Command width={10} height={10} />
          <Text className="text-white text-sm text-center">command</Text> 
        </View>
      )
    },
    {
      width: 5.43,
      keyCode: "space",
      display: (
        <View className="size-full">

        </View>
      )
    },
    {
      width: 1.235,
      keyCode: "command",
      isModifier: true,
      display: (
        <View className="justify-between h-full py-1 pt-2">
          <Command width={10} height={10} />
          <Text className="text-white text-sm text-center">command</Text> 
        </View>
      )
    },
    {
      keyCode: "alt",
      isModifier: true,
      display: (
        <View className="justify-between h-full py-1 pt-2">
          <Option width={10} height={10} />
          <Text className="text-white text-sm text-center">option</Text> 
        </View>
      )
    }
  ]
]
