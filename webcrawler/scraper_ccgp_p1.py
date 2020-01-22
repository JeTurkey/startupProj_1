from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from bs4 import BeautifulSoup
import requests
import time, random
import sys

# Chromedriver 路径
# driver = webdriver.Chrome('/Users/rayshi/Desktop/startupProj_1/webcrawler/chromedriver')


def output(string):
    openfile = open("./linkfile20200114.txt", "a+")
    openfile.write(str(string) + " \n")
    openfile.close()
# 起始日期 可修改此处
startYear = 2020
startMonth = 1
startDay = 8

endYear = 2020
endMonth = 1
endDay = 14
# Driver转入 网址
# driver.get('http://search.ccgp.gov.cn/bxsearch?searchtype=1&page_index=1&bidSort=0&buyerName=&projectId=&pinMu=0&bidType=7&dbselect=bidx&kw=&start_time=' + str(startYear) + '%3A' + str(startMonth) + '%3A' + str(startDay) + '&end_time=' + str(endYear) + '%3A' + str(endMonth) + '%3A' + str(endDay) + '&timeType=6&displayZone=&zoneId=&pppStatus=0&agentName=')

# pageCountInitial = 1

# # 获取总页数的计数
# pageCount = driver.find_element_by_xpath('/html/body/div[5]/div[1]/div/p[2]/a[6]').text
# entriesFound = driver.find_element_by_xpath('/html/body/div[5]/div[1]/div/p[1]/span[2]').text
# print('该时间段内有 ', pageCount, ' 页信息， 包含 ', entriesFound, '条公告')

# entriesParsed = 0
# currentEntries = 1
# # 大loop，用来control page count
# while pageCountInitial != pageCount:

# /html/body/div[5]/div[2]/div/div/div[1]/ul/li[20]/a

# ========================================
#           Requests 版本
# ========================================


# 总页面数 需要自己看做修改
page_end = 326

page_index = 9

total_parsed = 0

while page_index <= page_end:
    # request website data
    r = requests.get('http://search.ccgp.gov.cn/bxsearch?searchtype=1&page_index=' + str(page_index) + '&bidSort=0&buyerName=&projectId=&pinMu=0&bidType=7&dbselect=bidx&kw=&start_time=' + str(startYear) + '%3A' + str(startMonth) + '%3A' + str(startDay) + '&end_time=' + str(endYear) + '%3A' + str(endMonth) + '%3A' + str(endDay) + '&timeType=6&displayZone=&zoneId=&pppStatus=0&agentName=')
    # input into bs4
    soup = BeautifulSoup(r.content)

    # 随机一个时间 
    randomBreak = random.randint(60, 120)
    # 找到bid result 的ul
    bid_result = soup.find('ul', {'class': 'vT-srch-result-list-bid'})
    bid_list = bid_result.find_all('li')
    print('本页共 ', len(bid_list), ' 条数据')

    for items in bid_list:
        # 提醒部分
        print('当前页面 ', page_index, ' 已爬取 ', total_parsed)

        # 爬取项目有 标题、时间、采购人、代理机构、省份、购买内容、项目链接（供后期使用）
        # 此处初始化所有内容
        title = ''
        wholeString = ''
        date = ''
        caigouren = ''
        dailijigou = ''
        province = ''
        purchase_info = ''
        url = ''
        rst = ''
        # 截取 URL 部分
        try:
            url = items.contents[1].get('href')
        except:
            print('无法获得URL')
            pass
        # 标题
        try:
            title = items.contents[1].text.replace(" ", "").replace("\r", "").replace("\n", "")
        except:
            print('没有找到项目标题')
            pass
        # 剩余信息来自于whole string，所以需要先读取whole string
        try:
            wholeString = items.contents[5].text.replace(" ", "").replace("\r", "").replace("\n", "")
        except:
            print('wholeString部分出错')
            pass
        # 截取 日期 部分
        date = wholeString[:wholeString.index("|")][:10]
        # 更新 wholeString
        wholeString = wholeString[wholeString.index("|") + 1:]
        
        # 截取 采购人 部分
        caigouren = wholeString[:wholeString.index("|")][4:]
        # 更新 wholeString
        wholeString = wholeString[wholeString.index("|") + 1:]

        # 截取 代理机构 部分
        dailijigou = wholeString[:wholeString.index("|")][5:]
        # 更新 wholeString
        wholeString = wholeString[wholeString.index("|") + 1:]

        # 截取 省份 部分
        province = wholeString[:wholeString.index("|")]
        # 更新 wholeString
        wholeString = wholeString[wholeString.index("|") + 1:]

        # 截取 采购内容 部分 
        if len(str(items.find('img'))) > 5:
            purchase_info = 'PPP'
        else:
            purchase_info = wholeString

        print('标题 ', title, ' 日期 ', date, ' 采购人 ', caigouren, ' 代理机构 ', dailijigou, ' 省份 ', province, ' 采购内容 ', purchase_info, ' 链接 ', url)
        rst = title + ' | ' + date + ' | ' + caigouren + ' | ' + dailijigou + ' | ' + province + ' | ' + purchase_info + ' | ' + url
        output(rst)
        total_parsed += 1
    
    page_index += 1
    time.sleep(int(randomBreak))

print('爬取完成 共 ', page_index - 1, ' 页， ', total_parsed, ' 条')







