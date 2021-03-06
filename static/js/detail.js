/**
 * 详细页面JS文件
 */
$(function() {

    /**
     * 查询明细数据-不带百科数据
     */
    $.ajax({
        url:"/product_detail_data/nowiki/",
        type:"post",
        dataType:"json",
        data:{
                id:$("#product_id").val(),
                name:$("#product_name").val()
            },
        success:function(data){
            //设置详细信息
            setDetailData(data);
            //展示地图
            showDetailPlace(data.map_location);
        },
        error:function(data){

        }
    });

    /**
     * 查询百科数据
     */
    $.ajax({
        url:"/product_detail_data/wiki/",
        type:"post",
        dataType:"json",
        data:{
                id:$("#product_id").val(),
                name:$("#product_name").val()
            },
        success:function(data){
            //设置百科数据详细信息
            setWikiDetailData(data);
        },
        error:function(data){

        }
    });

    /**
     * 详细页面赋值
     * @param  data 
     */
    function setDetailData(data){
        $("#product_name_id").text(data.product_name);//物产名
        //物产来源方志
        var wcsource_fz = "";
        if(data.wcsource_fz != null && data.wcsource_fz.trim()!=""){
            wcsource_fz = "<a href='/fz_detail/?name="+data.wcsource_fz.trim()+"&wtime="+data.wtime+"' target='_blank'>"+data.wcsource_fz.trim()+"</a>"+
                "——<span>"+data.temporal+"</span>";
        }else{
            wcsource_fz = "无";
        }
        $("#wcsource_fz_id").append(wcsource_fz); 
        //物产来源其他古籍
        var wcsource_qt = data.wcsource_qt;
        if(wcsource_qt != null && wcsource_qt.length>0){
            var wcs_arr = wcsource_qt.split(";");
            for(var i in wcs_arr){
                if(wcs_arr[i].length > 0){
                    $("#wcsource_qt_id").append("<a href='/shlib/gj/?gj="+wcs_arr[i]+"' target='_blank'>《"+wcs_arr[i]+"》</a>");
                }
            }
        }else{
            $("#wcsource_qt_id").text("无");
        }

        //物产所属分类标签
        var category_qt = "";
        if(data.category_fz != null && data.category_fz!=""){
            category_qt += data.category_fz;
        }

        if(category_qt == ""){
            category_qt = "无";
        }
        $("#category_qt_id").append(category_qt);

        //物产相关人物
        if(data.Des_people != "" && data.Des_people != null){
            var ps = data.Des_people.split(";");
            for(var i in ps){
                if(ps[i] != ""){
                    $("#Des_people_id").append("<a href='/shlib/person/?person="+ps[i]+"' target='_blank'>  "+ps[i]+"   </a>");
                }
            }
        }else{
            $("#Des_people_id").append("无");
        }
        
        //物产描述
        if(data.desc != null && data.desc != ""){
            // 物产别名，物产相关人物，物产产地，物产引书
            var strNew = data.desc;
            //别名
            if(data.alternateName != null && data.alternateName != ""){
                var anames = data.alternateName.split(";");
                for(var i in anames){
                    if(anames[i] != "" && strNew.indexOf(anames[i]) >= 0){
                        strNew = strNew.replaceAll(anames[i],
                            '<span class="detail_alias_tip" data-container="body" data-toggle="m-tooltip" data-placement="top" data-original-title="别名：'+anames[i]+'">'+anames[i]+'</span>');
                    }
                }
            }
            //Des_people相关人物
            if(data.Des_people != null && data.Des_people != ""){
                var ps = data.Des_people.split(";");
                for(var i in ps){
                    if(ps[i] != "" && strNew.indexOf(ps[i]) >= 0){
                        strNew = strNew.replaceAll(ps[i],
                            "<a href='/shlib/person/?person="+ps[i].trim()+"' target='_blank' class='detail_relate_people_tip' " +
                            " data-container='body' data-toggle='m-tooltip' data-placement='top' data-original-title='相关人物："+ps[i]+"'>"+ps[i]+"</a>");
                    }
                }
            }

            //物产产地
            if(data.Des_site != null && data.Des_site != ""){
                var ds = data.Des_site.split(";");
                for(var i in ps){
                    if(ds[i] != "" && strNew.indexOf(ds[i]) >= 0){
                        strNew = strNew.replaceAll(ds[i],
                            "<a href='/shlib/place/?place="+ds[i].trim()+"' target='_blank' class='detail_wccd_tip' "+
                            " data-container='body' data-toggle='m-tooltip' data-placement='top' data-original-title='产地："+ds[i]+"'>"+ds[i]+"</a>");
                    }
                }
            }
            //物产引书
            if(data.Des_cite != null && data.Des_cite != ""){
                var dc = data.Des_cite.split(";");
                for(var i in dc){
                    if(dc[i] != "" && strNew.indexOf(dc[i]) >= 0){
                        strNew = strNew.replaceAll(dc[i],
                            "<a href='/shlib/gj/?gj="+dc[i].trim()+"' target='_blank' class='detail_ys_tip' "+
                            " data-container='body' data-toggle='m-tooltip' data-placement='top' data-original-title='引书："+dc[i]+"'>"+dc[i]+"</a>");
                    }
                }
            }

            //描述信息
            $("#desc_id").append("<h6 style='font-weight: bold;'>方志物产描述:</h6>");
            $("#desc_id").append(strNew);
            $("#desc_id").append("<br/>");

            //展示tip
            $("[data-toggle='m-tooltip']").tooltip();
        }

        //其他古籍描述
        if(!jQuery.isEmptyObject(data.gjdesc)){
            //描述信息
            $("#desc_id").append("<br/><h6 style='font-weight: bold;'>其他古籍物产描述:</h6>");
            for(var key in data.gjdesc){
                $("#desc_id").append("<span style='margin-left:15px;margin-right:5px;'>"+key+":</span><span>"+data.gjdesc[key]+"</span>");
                $("#desc_id").append("<br/>");
            }
        }
        
        //诗句
        if(data.poems != null && data.poems.count > 0){
            var poems = "";
            var poedata = data.poems.data;
            $("#desc_id").append("<br/><h6 style='font-weight: bold;'>相关诗句:</h6>");
            var name_len = 2;
            for(var i in poedata){
                if(null == poedata[i].author || poedata[i].author==""){
                    continue;
                }
                name_len = poedata[i].author.length>name_len?poedata[i].author.length:name_len;
                
                //诗句
                var href_a = '<div class="poems_title_width"><a href="javascript:;" data-toggle="m-popover" data-trigger="click" '+
                    ' title="" data-html="true"  '+
                    ' data-content="<div id=\'popover_id\'><a href=\'/shlib/person/?person='+poedata[i].author+'\' target=\'_blank\'>链接上图</a><br/><a href=\'/cbdb/?name='+poedata[i].author+'\' target=\'_blank\'>链接CBDB</a></div>" >'+poedata[i].author+'</a></div>';
                $("#desc_id").append(href_a);
                $("#desc_id").append("<span style='margin-left:5px;'>《"+poedata[i].title+"》-"+poedata[i].clause+"</span>");
                $("#desc_id").append("<br/>");
            }

            if(name_len>5){
                name_len = 5;
            }
            var width_ = name_len * 14 + "px";
            $(".poems_title_width").css("width",width_);
            $("[data-toggle='m-popover']").popover();
        }
    }

    /**
     * 百科数据详细信息
     * @param  data 
     */
    function setWikiDetailData(data){
        /**
         * 百科字段
         */
        if(!jQuery.isEmptyObject(data.wiki_info)){
            var wiki_info = "";
            //百度百科
            if(data.wiki_info.baidubaike != null){
                $("#wiki_info_id").append("<br/><h6 style='font-weight: bold;'>百度百科:</h6>");
                var baidu = data.wiki_info.baidubaike;
                //abstracts relatedImage
                if(baidu.abstracts != null){
                    $("#wiki_info_id").append("<div style='float:left;'><span>"+baidu.abstracts+"</span></div>");
                }
                if(baidu.relatedImage != null){
                    for(var i in baidu.relatedImage){
                        $("#wiki_info_id").append("<img src='"+baidu.relatedImage[i]+"' style='max-width:500px;min-width:200px;'/>");
                    }
                }
            }
            //互动百科
            if(data.wiki_info.hudongbaike != null){
                $("#wiki_info_id").append("<br/><h6 style='font-weight: bold;'>互动百科:</h6>");
                var hudong = data.wiki_info.hudongbaike;
                
                if(hudong.abstracts != null){
                    $("#wiki_info_id").append("<div style='float:left;'><span>"+hudong.abstracts+"</span></div>");
                }
                if(hudong.relatedImage != null){
                    for(var i in hudong.relatedImage){
                        $("#wiki_info_id").append("<img src='"+hudong.relatedImage[i]+"' style='max-width:500px;min-width:200px;'/>");
                    }
                }
            }
            //中国维基
            if(data.wiki_info.zhwiki != null){
                $("#wiki_info_id").append("<br/><h6 style='font-weight: bold;'>中国维基:</h6>");
                var wiki = data.wiki_info.zhwiki;
                
                if(wiki.abstracts != null){
                    $("#wiki_info_id").append("<div style='float:left;'><span>"+wiki.abstracts+"</span></div>");
                }
                if(wiki.relatedImage != null){
                    for(var i in wiki.relatedImage){
                        $("#wiki_info_id").append("<img src='"+wiki.relatedImage[i]+"' style='max-width:500px;min-width:200px;' />");
                    }
                }
            }
        }else{
            $("#wiki_info_id").text("无");
        }
    }
    
    /**
     * 地图展示
     * @param data 
     */
    function showDetailPlace(data){
        var map = new BMap.Map("yn_map");
        if(data.longitude != "" && data.latitude != "" 
            && data.place != "" && data.place != null){
            var point = new BMap.Point(data.longitude, data.latitude);
            map.centerAndZoom(point, 8);

            map.enableScrollWheelZoom();
            var marker = new BMap.Marker(point);  // 创建标注
            
            map.addOverlay(marker);               // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        
            var opts = {
                position :point,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(20, -10)    //设置文本偏移量
            }
            var label = new BMap.Label(data.place,opts);
            marker.setLabel(label);
        }else{
            //默认地图
            var point = new BMap.Point(102.699, 25.06);
            map.centerAndZoom(point, 8);
        }
    }
});