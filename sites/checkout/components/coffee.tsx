import React from 'react'

type CoffeeProps = {
  size?: number
}

export const Coffee = ({size}: CoffeeProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-2-inside-1" fill="white">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M61.9009 29C56.4836 29 52.6326 34.2714 54.2797 39.4323L63.9559 69.7512L53.025 107L45.2329 133.553C39.5954 152.763 53.9984 172 74.019 172H126.881C146.902 172 161.305 152.763 155.668 133.553L136.945 69.7512L146.621 39.4323C148.268 34.2714 144.417 29 138.999 29H61.9009Z"/>
      </mask>
      <path d="M54.2797 39.4323L56.185 38.8242L56.185 38.8242L54.2797 39.4323ZM63.9559 69.7512L65.875 70.3143L66.0474 69.7266L65.8612 69.1431L63.9559 69.7512ZM53.025 107L51.1059 106.437L53.025 107ZM45.2329 133.553L47.152 134.116L47.152 134.116L45.2329 133.553ZM155.668 133.553L153.748 134.116L155.668 133.553ZM136.945 69.7512L135.039 69.1431L134.853 69.7266L135.025 70.3143L136.945 69.7512ZM146.621 39.4323L148.526 40.0404L148.526 40.0404L146.621 39.4323ZM56.185 38.8242C54.9497 34.9535 57.8379 31 61.9009 31V27C55.1292 27 50.3155 33.5893 52.3744 40.0404L56.185 38.8242ZM65.8612 69.1431L56.185 38.8242L52.3744 40.0404L62.0506 70.3593L65.8612 69.1431ZM54.944 107.563L65.875 70.3143L62.0368 69.188L51.1059 106.437L54.944 107.563ZM47.152 134.116L54.944 107.563L51.1059 106.437L43.3138 132.989L47.152 134.116ZM74.019 170C55.3331 170 41.8903 152.046 47.152 134.116L43.3138 132.989C37.3005 153.481 52.6637 174 74.019 174V170ZM126.881 170H74.019V174H126.881V170ZM153.748 134.116C159.01 152.046 145.567 170 126.881 170V174C148.237 174 163.6 153.481 157.587 132.989L153.748 134.116ZM135.025 70.3143L153.748 134.116L157.587 132.989L138.864 69.188L135.025 70.3143ZM144.715 38.8242L135.039 69.1431L138.85 70.3592L148.526 40.0404L144.715 38.8242ZM138.999 31C143.063 31 145.951 34.9535 144.715 38.8242L148.526 40.0404C150.585 33.5892 145.771 27 138.999 27V31ZM61.9009 31H138.999V27H61.9009V31Z" fill="black" mask="url(#path-2-inside-1)"/>
      <path d="M53.0618 58.7614C52.1665 55.4281 54.6214 52 58.0728 52H142.927C146.379 52 148.834 55.4281 147.938 58.7614C146.852 62.8063 145.742 67.9335 145.742 72C145.742 76.0665 146.852 81.1937 147.938 85.2386C148.834 88.5719 146.379 92 142.927 92H58.0728C54.6214 92 52.1665 88.5719 53.0618 85.2386C54.1482 81.1937 55.2581 76.0665 55.2581 72C55.2581 67.9335 54.1482 62.8063 53.0618 58.7614Z" fill="#D8AFA0"/>
      <path d="M148.5 124C148.5 139.74 136.121 161 119 161C101.879 161 88 148.24 88 132.5C88 116.76 98.8792 108.5 116 108.5C133.121 108.5 145 118.5 148.5 124Z" fill="#4E3327"/>
      <path d="M147 159C136 170.5 132.204 168 101 168C76 168 65.8384 171.647 54.4999 159C41.5 144.5 49.9522 132.749 55 114C58.5 101 84.871 95.5 97.5 110C110.129 124.5 131 129.5 148.5 124C149 126 159.708 145.714 147 159Z" fill="#744B39"/>
    </svg>
  )
}

export default Coffee