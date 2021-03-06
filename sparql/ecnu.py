from requests_html import HTMLSession, lxml as lxml, HTML
import requests_html
from pyquery import PyQuery
#from lxml import etree
import requests

import sys
sys.path.append("..")
from util import cache

class ECNU_WEBGRAB:
    def __init__(self, uri):
        self.uri = uri
        self.root = None

    def get_fz_data(self):
        html = query_fz_from_ecnu(self.uri)
        self.root = HTML(html = html)

        return self.__get_data()

    def __get_data(self):
        #property_div = self.root.xpath(r'//*[@id="directs"]')[0]
        prefix_uri = self.root.xpath(r'//*[@id="directs"]/label/a/@href')
        prefix = cleanup(self.root.xpath(r'//*[@id="directs"]/label/a/text()'))
        name = self.root.xpath(r'//*[@id="directs"]/label/a/span/text()')

        properties = makeprops(prefix, name)
        #print(properties)

        values = [v.strip() for v in self.root.xpath(r'//*[@id="directs"]/div/*/*/text()')]
        #print(values)

        fz_brief = {k: v for k, v in zip(properties, values)}
        return self.__unfold_fz_data(fz_brief)

    def __unfold_fz_data(self, brief):
        need2unfold = {k: v for (k, v) in brief.items() if v.startswith(r'_:')}
        #print(need2unfold)

        prefix = cleanup(self.root.xpath(r'//*[@id="bnodes"]/label/a/text()'))
        name = self.root.xpath(r'//*[@id="bnodes"]/label/a/span/text()')

        properties = makeprops(prefix, name)
        #print(properties)

        values = self.root.xpath(r'//*[@id="bnodes"]/div[@class="c2 valuecnt"]')
        for value in values:
            print(value.absolute_links)
            print(value.text)
            print(value.links)
            print("-------------")


def cleanup(l):
    return [e.strip() for e in l if e.strip()]

def makeprops(prefix, name):
    return [''.join(item) for item in zip(prefix, name)]

@cache
def query_fz_from_ecnu(uri):
    req = requests.get(uri)
    #print(req.headers)
    with open(r'html_content.txt', 'w') as f:
        f.write(str(req.content))
    return req.content

if __name__ == "__main__":
    # recursive unfolder
    # http://sinopedia.library.sh.cn/ecnu/entity/work/bc2ac6c1a9bc4094861811d9c87068c2
    ecnu = ECNU_WEBGRAB(r"http://sinopedia.library.sh.cn/ecnu/entity/work/68a72a10ac274986aca1cb30ffb1c02a")
    print(ecnu.get_fz_data())