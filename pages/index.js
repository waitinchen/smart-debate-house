import { useState, useRef } from 'react';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const audioRef = useRef(null);

  const topics = [
    { id: 1, title: "人工智能是否會取代傳統教育模式？", category: "教育科技" },
    { id: 2, title: "台灣半導體產業是否過度依賴中國市場？", category: "產業經濟" },
    { id: 3, title: "遠距工作是否應成為未來主流工作模式？", category: "職場趨勢" }
  ];

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎭 超智能辯論所</h1>
          <p className="text-gray-600">世界第一個有聲AI辯論平台</p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-4">🎉 部署成功！</h2>
          <div className="text-green-700">
            <div>✅ Next.js架構正確建置</div>
            <div>✅ 七位智能辯手準備就緒</div>
            <div>✅ 語音功能架構完成</div>
            <div>🔄 完整辯論功能開發中...</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`px-6 py-2 rounded-lg font-medium ${
                isVoiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              🎙️ {isVoiceEnabled ? '語音開啟' : '語音關閉'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔥 熱辯主題</h2>
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
                <div className="font-semibold">#{topic.id} {topic.title}</div>
                <div className="text-sm text-gray-500">{topic.category}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedTopic && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
            <div className="font-semibold text-blue-900">🎯 當前主題：</div>
            <div className="text-blue-800">{selectedTopic.title}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">🎭 七位智能辯手</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">💙 正方</h3>
              <div className="space-y-3">
                {Object.entries(spirits).filter(([_, spirit]) => spirit.side === 'positive').map(([name, spirit]) => (
                  <div key={name} className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-xl mr-2">{spirit.icon}</span>
                    {name}【{spirit.nickname}】
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">❤️ 反方</h3>
              <div className="space-y-3">
                {Object.entries(spirits).filter(([_, spirit]) => spirit.side === 'negative').map(([name, spirit]) => (
                  <div key={name} className="bg-red-50 p-3 rounded-lg">
                    <span className="text-xl mr-2">{spirit.icon}</span>
                    {name}【{spirit.nickname}】
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-purple-600 mb-4">⚖️ 裁判</h3>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="text-xl mr-2">⚖️</span>
              天平【正義魔人】
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t">
          © 2025 超智能股份有限公司. All rights reserved.
        </div>

        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
