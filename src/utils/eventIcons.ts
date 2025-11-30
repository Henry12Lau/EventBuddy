export const getEventIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  // Basketball - 篮球
  if (lowerTitle.includes('basketball') || lowerTitle.includes('basket') || 
      lowerTitle.includes('篮球') || lowerTitle.includes('籃球')|| lowerTitle.includes('籃波')) return '🏀';
  
  // Soccer/Football - 足球
  if (lowerTitle.includes('soccer') || lowerTitle.includes('football') || 
      lowerTitle.includes('足球')) return '⚽';
  
  // Tennis - 网球
  if (lowerTitle.includes('tennis') || 
      lowerTitle.includes('网球') || lowerTitle.includes('網球')) return '🎾';
  
  // Volleyball - 排球
  if (lowerTitle.includes('volleyball') || lowerTitle.includes('volley') || 
      lowerTitle.includes('排球')) return '🏐';
  
  // Baseball - 棒球
  if (lowerTitle.includes('baseball') || 
      lowerTitle.includes('棒球')) return '⚾';
  
  // Badminton - 羽毛球
  if (lowerTitle.includes('badminton') || 
      lowerTitle.includes('羽毛球')) return '🏸';
  
  // Table Tennis - 乒乓球
  if (lowerTitle.includes('table tennis') || lowerTitle.includes('ping pong') || 
      lowerTitle.includes('乒乓球') || lowerTitle.includes('桌球')) return '🏓';
  
  // Golf - 高尔夫
  if (lowerTitle.includes('golf') || 
      lowerTitle.includes('高尔夫') || lowerTitle.includes('高爾夫')) return '⛳';
  
  // Swimming - 游泳
  if (lowerTitle.includes('swim') || lowerTitle.includes('pool') || 
      lowerTitle.includes('游泳')) return '🏊';
  
  // Running - 跑步
  if (lowerTitle.includes('run') || lowerTitle.includes('jog') || lowerTitle.includes('marathon') || 
      lowerTitle.includes('跑步') || lowerTitle.includes('马拉松') || lowerTitle.includes('馬拉松')) return '🏃';
  
  // Cycling - 骑行/单车
  if (lowerTitle.includes('bike') || lowerTitle.includes('cycling') || 
      lowerTitle.includes('骑行') || lowerTitle.includes('騎行') || 
      lowerTitle.includes('单车') || lowerTitle.includes('單車') || 
      lowerTitle.includes('自行车') || lowerTitle.includes('自行車')) return '🚴';
  
  // Gym/Fitness - 健身
  if (lowerTitle.includes('gym') || lowerTitle.includes('workout') || lowerTitle.includes('fitness') || 
      lowerTitle.includes('健身') || lowerTitle.includes('健身房')) return '💪';
  
  // Yoga - 瑜伽
  if (lowerTitle.includes('yoga') || 
      lowerTitle.includes('瑜伽')) return '🧘';
  
  // Boxing - 拳击
  if (lowerTitle.includes('boxing') || 
      lowerTitle.includes('拳击') || lowerTitle.includes('拳擊')) return '🥊';
  
  // Skiing - 滑雪
  if (lowerTitle.includes('ski') || lowerTitle.includes('snow') || 
      lowerTitle.includes('滑雪')) return '⛷️';
  
  // Surfing - 冲浪
  if (lowerTitle.includes('surf') || 
      lowerTitle.includes('冲浪') || lowerTitle.includes('衝浪')) return '🏄';
  
  // Climbing - 攀岩
  if (lowerTitle.includes('climb') || lowerTitle.includes('boulder') || 
      lowerTitle.includes('攀岩') || lowerTitle.includes('攀登')) return '🧗';
  
  // Dance - 舞蹈
  if (lowerTitle.includes('dance') || 
      lowerTitle.includes('舞蹈')) return '💃';
  
  // Hiking - 徒步/登山
  if (lowerTitle.includes('hike') || lowerTitle.includes('hiking') || 
      lowerTitle.includes('徒步') || lowerTitle.includes('登山') || lowerTitle.includes('爬山')) return '🥾';
  
  return '🎯'; // Default icon
};
