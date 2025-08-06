async function getCoordinatesFromAddress(address) {
  const geocoder = new AMap.Geocoder({
    city: "全国", // 设置地理编码的范围
    radius:1000
  });

  return new Promise((resolve, reject) => {
    geocoder.getLocation(address, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        if (result.geocodes.length > 0) {
          const location = result.geocodes[0].location;
          resolve({ lat: location.lat, lng: location.lng,
            formattedAddress: result.geocodes[0].formattedAddress // 标准化地址
           });
        } else {
          reject(new Error('未找到匹配的地址'));
        }
      } else {
        reject(new Error(`地址解析失败: ${result.info}`));
      }
    });
  });
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const distance = AMap.GeometryUtil.distance([lng1, lat1], [lng2, lat2]);
  return distance; // 返回值单位为米
}

export const verifyLocation=async(userAddress, userLat, userLng, threshold = 100) =>{
  try {
    // 步骤1: 解析用户提供的地址获取实际经纬度
    const parsedLocation = await getCoordinatesFromAddress(userAddress);

    // 步骤2: 计算用户输入的经纬度与解析结果的距离
    const distance = calculateDistance(
      userLat,    // 用户输入的纬度
      userLng,    // 用户输入的经度
      parsedLocation.lat,  // 解析得到的纬度
      parsedLocation.lng   // 解析得到的经度
    );

    // 步骤3: 根据距离和阈值判断验证结果
    return {
      success: distance <= threshold,
      distance: parseFloat(distance.toFixed(2)),
      threshold,
      parsedAddress: parsedLocation.formattedAddress,
      parsedLat: parsedLocation.lat,
      parsedLng: parsedLocation.lng,
      message: distance <= threshold
        ? `验证通过，地址与经纬度匹配（距离约${distance.toFixed(2)}米）`
        : `验证失败，地址与经纬度不匹配（距离约${distance.toFixed(2)}米，超过${threshold}米阈值）`
    };
  } catch (error) {
    // 处理错误情况
    return {
      success: false,
      error: error.message,
      message: `验证过程出错: ${error.message}`
    };
  }
}
