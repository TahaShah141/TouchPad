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
  { display: functionKey("f1", f1) },
  { display: functionKey("f2", f2) },
  { display: functionKey("f3", f3) },
  { display: functionKey("f4", f4) },
  { display: functionKey("f5", f5) },
  { display: functionKey("f6", f6) },
  { display: functionKey("f7", f7) },
  { display: functionKey("f8", f8) },
  { display: functionKey("f9", f9) },
  { display: functionKey("f10", f10) },
  { display: functionKey("f11", f11) },
  { display: functionKey("f12", f12) },
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
}

export const KEYS: KeyType[][] = [
  [
    {
      width: 1.5,
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">esc</Text>
        </View>
      )
    },
    ...functionKeys,
    {
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
    display: stackedKey(['~', '`'])
    },
    {
      display: stackedKey(['!', '1'])
    },
    {
      display: stackedKey(['@', '2'])
    },
    {
      display: stackedKey(['#', '3'])
    },
    {
      display: stackedKey(['$', '4'])
    },
    {
      display: stackedKey(['%', '5'])
    },
    {
      display: stackedKey(['^', '6'])
    },
    {
      display: stackedKey(['&', '7'])
    },
    {
      display: stackedKey(['*', '8'])
    },
    {
      display: stackedKey(['(', '9'])
    },
    {
      display: stackedKey([')', '0'])
    },
    {
      display: stackedKey(['_', '-'])
    },
    {
      display: stackedKey(['+', '='])
    },
    {
      width: 1.5,
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
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">tab</Text>
        </View>
      )
    },
    {
      display: alphabetKey("Q")
    },
    {
      display: alphabetKey("W")
    },
    {
      display: alphabetKey("E")
    },
    {
      display: alphabetKey("R")
    },
    {
      display: alphabetKey("T")
    },
    {
      display: alphabetKey("Y")
    },
    {
      display: alphabetKey("U")
    },
    {
      display: alphabetKey("I")
    },
    {
      display: alphabetKey("O")
    },
    {
      display: alphabetKey("P")
    },
    {
      display: stackedKey(['{', '['])
    },
    {
      display: stackedKey(['}', ']'])
    },
    {
      display: stackedKey(['|', '\\'])
    }
  ],
  [
    {
      width: 1.8,
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">caps lock</Text>
        </View>
      )
    },
    {
      display: alphabetKey("A")
    },
    {
      display: alphabetKey("S")
    },
    {
      display: alphabetKey("D")
    },
    {
      display: alphabetKey("F")
    },
    {
      display: alphabetKey("G")
    },
    {
      display: alphabetKey("H")
    },
    {
      display: alphabetKey("J")
    },
    {
      display: alphabetKey("K")
    },
    {
      display: alphabetKey("L")
    },
    {
      display: stackedKey([':', ';'])
    },
    {
      display: stackedKey(['"', "'"])
    },
    {
      width: 1.8,
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
      display: (
        <View className="size-full justify-end items-start">
          <Text className="text-white text-lg pb-0.5">shift</Text>
        </View>
      )
    },
    {
      display: alphabetKey("Z")
    },
    {
      display: alphabetKey("X")
    },
    {
      display: alphabetKey("C")
    },
    {
      display: alphabetKey("V")
    },
    {
      display: alphabetKey("B")
    },
    {
      display: alphabetKey("N")
    },
    {
      display: alphabetKey("M")
    },
    {
      display: stackedKey(['<', ','])
    },
    {
      display: stackedKey(['>', '.'])
    },
    {
      display: stackedKey(['?', '/'])
    },
    {
      width: 2.35,
      display: (
        <View className="size-full justify-end items-end">
          <Text className="text-white text-lg pb-0.5">shift</Text>
        </View>
      )
    },
  ],
  [
    {
      display: (
        <View className="justify-between h-full py-1 pb-2">
          <Text className="text-white text-sm text-right">fn</Text> 
          <Globe width={10} height={10} />
        </View>
      )
    },
    {
      display: (
        <View className="justify-between h-full py-1 pt-2 items-end">
          <Control width={10} height={10} />
          <Text className="text-white text-sm text-center">control</Text> 
        </View>
      )
    },
    {
      display: (
        <View className="justify-between h-full py-1 pt-2 items-end">
          <Option width={10} height={10} />
          <Text className="text-white text-sm text-center">option</Text> 
        </View>
      )
    },
    {
      width: 1.25,
      display: (
        <View className="justify-between h-full py-1 pt-2 items-end">
          <Command width={10} height={10} />
          <Text className="text-white text-sm text-center">command</Text> 
        </View>
      )
    },
    {
      width: 5.45,
      display: (
        <View className="size-full">

        </View>
      )
    },
    {
      width: 1.25,
      display: (
        <View className="justify-between h-full py-1 pt-2">
          <Command width={10} height={10} />
          <Text className="text-white text-sm text-center">command</Text> 
        </View>
      )
    },
    {
      display: (
        <View className="justify-between h-full py-1 pt-2">
          <Option width={10} height={10} />
          <Text className="text-white text-sm text-center">option</Text> 
        </View>
      )
    },
  ]
]