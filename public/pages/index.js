import { useState, useRef } from 'react';

export default function SuperSmartDebateHouse() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 辯論主題
  const topics = [
    { id: 1, title: "人工智能是否會取代傳統教育模式？", category: "教育科技" },
    { id: 2, title: "台灣半導體產業是否過度依賴中國市場？", category: "產業經濟" },
    { id: 3, title: "遠距工作是否應成為未來主流工作模式？", category: "職場趨勢" },
    { id: 4, title: "電動車普及是否能有效解決環境問題？", category: "環保科技" },
    { id: 5, title: "社群媒體是否加劇了社會分化？", category: "社會議題" }
  ];

  // 智能辯手配置
  const spirits = {
    '晨星': { icon: '⭐', nickname: '數據控', side: 'positive' },
    '心語': { icon: '💖', nickname: '暖心姊', side: 'positive' },
    '智慧': { icon: '🧠', nickname: '老司機', side: 'positive' },
    '月影': { icon: '🌙', nickname: '毒舌精', side: 'negative' },
    '柔光': { icon: '🕊️', nickname: '和事佬', side: 'negative' },
    '真言': { icon: '⚡', nickname: '嗆辣妹', side: 'negative' },
    '天平': { icon: '⚖️', nickname: '正義魔人', side: 'judge' }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎭 超智能辯論所</h1>
          <p className="text-gray-600">世界第一個有聲AI辯論平台</p>
        </div>

        {/* 功能說明 */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4">✨ 平台特色</h2>
          <div className="grid md:grid-cols-2 gap-4 text-blue-700">
            <div>• 🎙️ 七位智能辯手語音辯論</div>
            <div>• 🎯 專業八法辯證技巧</div>
            <div>• 📊 三輪制完整辯論流程</div>
            <div>• ⚖️ 智能裁判公正評判</div>
          </div>
        </div>

        {/* 語音控制 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isVoiceEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              🎙️ {isVoiceEnabled ? '語音功能開啟' : '語音功能關閉'}
            </button>
            <div className="text-sm text-gray-600">
              {isVoiceEnabled ? '準備聆聽智能辯手的專業辯論' : '當前為靜音模式'}
            </div>
          </div>
        </div>

        {/* 辯論主題選擇 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔥 請點選以下任一熱辯主題</h2>
          <div className="grid gap-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedTopic?.id === topic.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">#{topic.id} {topic.title}</div>
                <div className="text-sm text-gray-500">{topic.category}</div>
                <div className="text-sm text-blue-600 mt-2">點擊開始觀看辯論 →</div>
              </div>
            ))}
          </div>
        </div>

        {/* 選中主題顯示 */}
        {selectedTopic && (
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
            <div className="font-semibold text-green-900">🎯 當前辯論主題：</div>
            <div className="text-green-800 text-lg">{selectedTopic.title}</div>
            <div className="text-green-600 mt-2">
              智能辯手們正在準備精彩的三輪辯論...
            </div>
          </div>
        )}

        {/* 智能辯手介紹 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">🎭 七位智能辯手介紹</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 正方團隊 */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">💙 正方團隊</h3>
              <div className="space-y-3">
                {Object.entries(spirits).filter(([_, spirit]) => spirit.side === 'positive').map(([name, spirit]) => (
                  <div key={name} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{spirit.icon}</span>
                      <div>
                        <div className="font-semibold text-blue-900">{name}</div>
                        <div className="text-blue-700 text-sm">【{spirit.nickname}】</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 反方團隊 */}
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">❤️ 反方團隊</h3>
              <div className="space-y-3">
                {Object.entries(spirits).filter(([_, spirit]) => spirit.side === 'negative').map(([name, spirit]) => (
                  <div key={name} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{spirit.icon}</span>
                      <div>
                        <div className="font-semibold text-red-900">{name}</div>
                        <div className="text-red-700 text-sm">【{spirit.nickname}】</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 裁判 */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-purple-600 mb-4">⚖️ 智能裁判</h3>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <div className="font-semibold text-purple-900">天平</div>
                  <div className="text-purple-700 text-sm">【正義魔人】</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 開發狀態說明 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">🚧 開發狀態</h3>
          <div className="text-yellow-700 text-sm">
            <div>✅ 基礎架構部署完成</div>
            <div>✅ 智能辯手角色設計完成</div>
            <div>🔄 語音功能整合中...</div>
            <div>🔄 完整辯論流程開發中...</div>
          </div>
        </div>

        {/* 版權信息 */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t">
          © 2025 智能辯論所 | 超智能股份有限公司. All rights reserved.
        </div>

        {/* 隱藏音頻元素 */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
