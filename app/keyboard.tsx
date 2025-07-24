import { KeyboardKey } from '@/components/KeyboardKey';
import ArrowKeys from '@/lib/ArrowKeys';
import { KEYS } from '@/lib/KEYS';
import { useWebSocket } from '@/lib/useWebSocket';
import { sendMessageWrapper } from '@/lib/utils';
import { View } from 'react-native';

export default function Keyboard() {
  const { ws } = useWebSocket();
  const sendMessage = sendMessageWrapper(ws);

  return (
    <View className='flex-1 bg-neutral-900 justify-center items-center'>
      <View className='gap-1.5 portrait:rotate-90'>
        {KEYS.map((row, r) => (
          <View key={r} className='flex flex-row gap-1.5'>
            {row.map((key, i) => (
              <KeyboardKey {...key} key={i} sendMessage={sendMessage} />
            ))}
            {r === 5 && <ArrowKeys />}
          </View>
        ))}
      </View>
    </View>
  );
}
