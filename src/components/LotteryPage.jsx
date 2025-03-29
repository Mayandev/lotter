import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import bedImage from '../assets/bed.JPG';  // 添加图片导入
import foodImage from '../assets/food.jpg';  // 添加图片导入\
import xiaoxin from '../assets/xiaoxin.jpg';  // 添加图片导入
import labubu from '../assets/labubu.png';  // 添加图片导入
import album from '../assets/album.jpg';  // 添加图片导入
import clock from '../assets/clock.jpg';  // 添加图片导入
import fuwocheng from '../assets/fuwocheng.jpg';  // 添加图片导入
import redpack from '../assets/redpack.png';  // 添加图片导入
import magic from '../assets/magic.png';  // 添加图片导入\
import trans from '../assets/trans.png'; 

const prizes = [
  { id: 1, type: 'gift', content: '请欣赏邹明远的魔术表演🪄🪄', image: magic },
  { id: 2, type: 'gift', content: '1000 块以上的大餐任选，一年内有效', image: foodImage },
  { id: 4, type: 'gift', content: '奇奇蒂蒂四件套，祝你拥有好睡眠', image: bedImage },
  { id: 5, type: 'punishment', content: '🧧🧧 群发 200 红包', image: redpack },
  { id: 7, type: 'gift', content: '精美相册一份,生日当天查收', image: album },
  { id: 8, type: 'gift', content: '蜡笔小新可爱大鼻嘎，每人一份', image: xiaoxin },
  { id: 6, type: 'gift', content: '💰💰盲按四下邹明远手机，随机转账', image: trans },
  { id: 9, type: 'gift', content: '泡泡玛特盲盒一个', image: labubu },
  { id: 10, type: 'gift', content: '哈利波特 9 又 3/4 站牌一个（声控版）', image: clock },
  { id: 11, type: 'punishment', content: '邹明远俯卧撑20个', image: fuwocheng },

];

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffe5e5;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
`;

const Title = styled(motion.h1)`
  color: #ff69b4;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const LotteryButton = styled(motion.button)`
  background-color: #ff69b4;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  
  @media screen and (max-width: 480px) {
    padding: 12px 25px;
    font-size: 1rem;
  }
`;

const ScratchCard = styled.div`
  position: relative;
  width: 400px;
  height: 200px;
  margin: 20px auto;
  border-radius: 15px;
  overflow: hidden;
  
  @media screen and (max-width: 480px) {
    width: 360px;
    height: 180px;
  }
`;

const ScratchResult = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.image ? `url(${props.image}) center/contain no-repeat` : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ff69b4;
  font-weight: bold;
  padding: 20px;
  text-align: center;
  background-color: white;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
`;

// 添加模态弹窗相关样式组件
const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 90%;
  width: 400px;
  text-align: center;
  margin: 0;
  
  @media screen and (max-width: 480px) {
    width: 85%;
    padding: 20px;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  margin: 20px 0;
  width: 100%;
  
  img {
    max-width: 100%;
    border-radius: 10px;
    margin: 10px 0;
    height: auto;
    object-fit: contain;
  }

  p {
    margin: 15px 0;
    font-size: 1.2rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  background: ${props => props.primary ? '#ff69b4' : 'white'};
  color: ${props => props.primary ? 'white' : '#ff69b4'};
  border: ${props => props.primary ? 'none' : '2px solid #ff69b4'};
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

function LotteryPage() {
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [showModal, setShowModal] = useState(false);  // Add this line
  const canvasRef = useRef(null);
  const [displayText, setDisplayText] = useState('开始刮开看看吧~');

  useEffect(() => {
    if (!result) {
      // 获取已抽中的奖项
      const drawnPrizes = JSON.parse(localStorage.getItem('drawnPrizes') || '[]');
      // 过滤掉已抽中的奖项
      const availablePrizes = prizes.filter(prize => !drawnPrizes.includes(prize.id));

      // 如果所有奖项都抽完了，重置
      if (availablePrizes.length === 0) {
        localStorage.setItem('drawnPrizes', '[]');
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        setResult(randomPrize);
      } else {
        const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        setResult(randomPrize);
      }
      initCanvas();
    }
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 设置画布大小
    canvas.width = 360;
    canvas.height = 180;

    // 填充灰色涂层
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加提示文字
    ctx.font = '20px Arial';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'center';
    ctx.fillText('刮奖区域', canvas.width / 2, canvas.height / 2);
  };

  const handleScratch = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let scratched = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) scratched++;
    }

    if (scratched / (pixels.length / 4) > 0.8 && !isScratched) {
      setIsScratched(true);
      setShowConfetti(result.type === 'gift');
      setShowModal(true);

      const drawnPrizes = JSON.parse(localStorage.getItem('drawnPrizes') || '[]');
      drawnPrizes.push(result.id);
      localStorage.setItem('drawnPrizes', JSON.stringify(drawnPrizes));

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  const handleRestart = () => {
    setShowModal(false);
    setIsScratched(false);
    setShowConfetti(false);

    // 重新获取奖项
    const drawnPrizes = JSON.parse(localStorage.getItem('drawnPrizes') || '[]');
    const availablePrizes = prizes.filter(prize => !drawnPrizes.includes(prize.id));

    if (availablePrizes.length === 0) {
      localStorage.setItem('drawnPrizes', '[]');
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(randomPrize);
    } else {
      const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
      setResult(randomPrize);
    }

    // 重新初始化画布
    initCanvas();
  };

  return (
    <Container>
      {showConfetti && <ReactConfetti />}

      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        宝贝生日快乐，请领取你的生日礼物
      </Title>

      <ScratchCard>
        <ScratchResult image={result?.image}>
        </ScratchResult>
        <Canvas
          ref={canvasRef}
          onMouseMove={(e) => e.buttons === 1 && handleScratch(e)}
          onTouchMove={handleScratch}
        />
      </ScratchCard>

      <LotteryButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRestart}
        style={{ opacity: isScratched ? 1 : 0 }}
      >
        再来一次
      </LotteryButton>

      <AnimatePresence>
        {showModal && (
          <>
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <Modal
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <h2>{result?.type === 'gift' ? '🎉 恭喜！' : '😝 哎呀！'}</h2>
              <ModalContent>
                {result?.image && <img src={result.image} alt="奖品图片" />}
                <p>{result?.content}</p>
              </ModalContent>

              <ModalButton primary onClick={handleRestart}>
                再来一次
              </ModalButton>

            </Modal>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default LotteryPage;