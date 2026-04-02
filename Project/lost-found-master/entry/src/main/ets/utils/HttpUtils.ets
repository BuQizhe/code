import { http } from '@kit.NetworkKit';

export class HttpUtils {
  static async get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const httpRequest = http.createHttp()
      console.log(`GET请求URL: ${url}`)
      httpRequest.request(
        url,
        {
          method: http.RequestMethod.GET
        },
        (err, response) => {
          if (!err) {
            if (response.result) {
              if (typeof response.result === 'string') {
                console.log(`返回结果为: ${response.result}`)
                resolve(response.result)
              } else if (response.result instanceof ArrayBuffer) {
                // 处理 ArrayBuffer 类型的数据
                const uint8Array = new Uint8Array(response.result)
                let responseStr = ''
                for (let i = 0; i < uint8Array.length; i++) {
                  responseStr += String.fromCharCode(uint8Array[i])
                }
                resolve(responseStr)
              }
            } else {
              reject(new Error('No response data'))
            }
          } else {
            reject(err)
          }
        }
      )
    })
  }

  static async post(url: string, data: Record<string, string | number | object>): Promise<string> {
    return new Promise((resolve, reject) => {
      const httpRequest = http.createHttp()

      // 将数据转换为 key=value&key2=value2 的形式
      const parts: string[] = []
      const entries = Object.entries(data)
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const key = entry[0]
        const value = entry[1]
        const encodedKey = encodeURIComponent(key)
        const encodedValue = encodeURIComponent(String(value))
        parts.push(`${encodedKey}=${encodedValue}`)
      }
      const formData = parts.join('&')

      console.log(`POST请求URL:${url}`)
      console.log(`POST请求参数:${formData}`)

      httpRequest.request(
        url,
        {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          extraData: formData
        },
        (err, response) => {
          if (!err) {
            if (response.result) {
              if (typeof response.result === 'string') {
                console.log(`返回结果为: ${response.result}`)
                resolve(response.result)
              } else if (response.result instanceof ArrayBuffer) {
                // 处理 ArrayBuffer 类型的数据
                const uint8Array = new Uint8Array(response.result)
                let responseStr = ''
                for (let i = 0; i < uint8Array.length; i++) {
                  responseStr += String.fromCharCode(uint8Array[i])
                }
                resolve(responseStr)
              }
            } else {
              reject(new Error('No response data'))
            }
          } else {
            reject(err)
          }
        }
      )
    })
  }
}