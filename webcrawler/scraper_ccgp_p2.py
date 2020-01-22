import requests
from bs4 import BeautifulSoup
import random, time

# 打开文件
refFile = open('./linkfile20200107.txt', 'r')

def outputUncleaned(urlString):
    openfile = open('./uncleanFile20200107.txt', 'a+')
    openfile.write(str(urlString) + '\n')
    openfile.close()

def outputCleaned(resultString):
    openfile = open('./cleanFile20200107.txt', 'a+')
    openfile.write(str(resultString) + '\n')
    openfile.close()

# 监测用变量

dataParsed = 0
l = []
for lines in refFile.readlines():
    l.append(lines)

final_l = l[3616+466+235:]
# loop每一行
# for lines in refFile.readlines():
for lines in final_l:
    currentURL = lines[lines.index('http'): -2]
    print(currentURL)
    # Requesitng url
    r = requests.get(currentURL)
    soup = BeautifulSoup(r.content)
    # Extractingn the bid table
    bid_table = soup.find('div', {'class': 'table'})
    # saved result
    rst = ''

    # Extracting all elements form the bid table
    for items in bid_table.find_all('tr'):
        # store item elements
        temp_list = items.find_all('td')
        if len(temp_list) > 1:
            # print(temp_list[0].text, ' : ', temp_list[1].text)
            rst += temp_list[0].text + ' : ' + temp_list[1].text + ' | '

    try:
        detail = soup.find('div', {'class': 'vF_detail_content_container'}).text
        detail_text = detail.replace('\n', '').replace('\xa0', '')
    except:
        print('Cleaning text issue ')

    # Appending detail into rst
    rst += ' | ' + '详细内容 : ' + detail_text + ' | '

    # Check if detail have table tag
    try:
        iftabletag = soup.find('div', {'class': 'vF_detail_content_container'}).find('table')
        if len(iftabletag) >= 1:
            tabletag = 'Yes' 
        else:
            tabletag = 'No'
        rst += ' | Table Tag : ' + tabletag + ' | '
    except:
        print('Error in find table tag')

    # Append url at the end
    rst += currentURL
    print(rst)
    if rst.count('详情') >= 3:
        outputUncleaned(rst)
    else:
        outputCleaned(rst)
    
    # Pause
    randomBreak = random.randint(5, 15)
    time.sleep(randomBreak)

    # 监测变量response
    dataParsed += 1

    print('已完成 ', dataParsed, ' 条爬取, 暂停 ', randomBreak, ' 秒')