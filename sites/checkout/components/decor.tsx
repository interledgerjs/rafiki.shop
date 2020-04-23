import * as React from 'react'

const Decor: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <div className="absolute -z-10" style={{
        // left: 'calc(50% - 213px/2 - 117px)',
        // top: 'calc(50% - 222.34px/2 - 258.33px)',
      }}>
        <Vector/>
      </div>
      <div className="absolute -z-10" style={{
        left: '196px',
        top: '-47px',
      }}>
        <Vector1/>
      </div>
      <div className="absolute -z-10" style={{
        left: '53px',
        top: '219px',
      }}>
        <Vector2/>
      </div>
      <div className="absolute -z-10" style={{
        left: '512px',
        top: '483.71px',
        transform: 'rotate(-180deg)',
      }}>
        <Vector3/>
      </div>
      <div className="absolute -z-10" style={{
        left: '512px',
        top: '483.71px',
        transform: 'rotate(-180deg)',
      }}>
        <Vector4/>
      </div>
      <div className="transform absolute -z-10" style={{
        left: '203px',
        top: '556px',
      }}>
        <Vector5/>
      </div>
    </div>
  )
}

export default Decor

const Vector = () => {
  return (
    <svg width="177" height="187" viewBox="0 0 177 187" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M67.3703 -33.0236C91.2449 -38.327 118.167 -37.3464 138.304 -23.4675C158.618 -9.46584 166.753 15.9702 173.062 39.8225C179.068 62.5283 177.452 85.455 173.225 108.558C168.339 135.257 171.02 171.252 146.778 183.459C121.664 196.106 95.461 163.124 67.3703 161.861C41.4891 160.697 14.8638 190.421 -7.01411 176.545C-28.5534 162.884 -19.1603 128.903 -24.0599 103.871C-28.2065 82.6865 -41.5064 61.4338 -33.4669 41.3999C-25.5343 21.6323 -0.9862 16.3156 16.1514 3.66705C33.4729 -9.11717 46.3542 -28.3551 67.3703 -33.0236Z" fill="#E17757"/>
    </svg>

  )
}

const Vector1 = () => {
  return (
    <svg width="179" height="181" viewBox="0 0 179 181" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M140.26 -46.4142C162.133 -43.6662 176.145 -23.6687 194.193 -11.0118C212.667 1.9434 235.503 9.15051 247.097 28.5073C260.438 50.7783 270.297 78.1762 262.438 102.919C254.566 127.703 230.664 144.36 206.927 154.979C186.117 164.289 162.776 154.01 140.26 157.578C111.01 162.214 84.2126 188.595 56.2425 178.861C27.252 168.773 1.40484 139.447 0.0378878 108.782C-1.33101 78.0728 34.755 60.6399 49.7772 33.8211C60.6386 14.4302 58.8625 -11.1793 75.4919 -25.9252C92.8592 -41.3256 117.229 -49.3078 140.26 -46.4142Z" fill="#EAD2D2"/>
    </svg>
  )
}

const Vector2 = () => {
  return (
    <svg width="223" height="207" viewBox="0 0 223 207" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M110.563 1.17799C132.614 -4.24991 154.409 10.1578 173.554 22.3848C193.795 35.3114 218.712 49.023 222.616 72.741C226.501 96.3365 199.784 113.08 192.219 135.762C184.756 158.134 198.922 190.927 178.997 203.509C158.675 216.343 134.458 189.845 110.563 187.326C90.5909 185.221 69.8575 199.018 51.855 190.105C32.9232 180.733 23.3954 159.723 15.3304 140.179C6.66006 119.168 -6.93499 94.4079 4.18654 74.5878C15.5037 54.4189 47.6399 61.824 66.6637 48.6958C84.8521 36.1441 89.1122 6.45815 110.563 1.17799Z" fill="#E89C84"/>
    </svg>
  )
}

const Vector3 = () => {
  return (
    <svg width="135" height="237" viewBox="0 0 135 237" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.22866 5.8209C29.9042 6.46998 57.1845 -3.70097 75.3061 11.549C93.3992 26.7751 83.4064 56.7801 92.6483 78.5465C103.374 103.807 142.59 122.095 133.191 147.878C123.664 174.014 79.814 160.593 56.9592 176.451C35.0037 191.685 32.4927 231.04 6.22866 235.972C-19.4791 240.799 -41.0761 215.997 -60.5306 198.512C-78.1885 182.642 -95.5358 164.384 -99.4753 140.971C-103.18 118.952 -86.2388 100.009 -80.7474 78.3657C-74.6738 54.4285 -84.6214 23.5027 -65.6565 7.68446C-46.7874 -8.05386 -18.3332 5.14753 6.22866 5.8209Z" fill="#F6D5CC"/>
    </svg>

  )
}

const Vector4 = () => {
  return (
    <svg width="69" height="223" viewBox="0 0 69 223" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M95.0272 218.47C73.504 213.312 59.1077 195.243 42.3228 180.817C27.1748 167.798 8.26091 157.469 1.98865 138.506C-4.29732 119.5 6.05723 100.14 9.09483 80.3545C12.9147 55.4729 2.59634 23.8074 22.0502 7.83139C41.3276 -7.99974 70.729 4.14178 95.0272 9.78456C114.508 14.3087 131.661 23.9197 146.933 36.833C161.187 48.8856 170.195 64.5691 179.174 80.9348C190.475 101.535 207.544 120.859 205.888 144.296C204.054 170.242 191.571 196.938 169.953 211.402C148.58 225.702 120.035 224.463 95.0272 218.47Z" fill="#F19950"/>
    </svg>
  )
}

const Vector5 = () => {
  return (
    <svg width="172" height="111" viewBox="0 0 172 111" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M128.778 3.68961C153.773 -1.55448 181.165 -2.65754 203.239 10.188C226.333 23.6268 244.415 47.2958 248.96 73.626C253.276 98.6365 239.225 122.492 226.402 144.396C215.88 162.369 199.742 174.923 182.673 186.856C165.941 198.555 149.194 212.729 128.778 212.65C108.392 212.572 93.6953 194.978 75.1821 186.444C50.2187 174.936 10.6433 179.955 1.56462 154.01C-7.448 128.253 24.7912 106.748 39.183 83.5643C49.6193 66.7524 59.2437 50.4673 74.014 37.2995C90.4024 22.689 107.29 8.19775 128.778 3.68961Z" fill="#F5DBBA"/>
    </svg>

  )
}