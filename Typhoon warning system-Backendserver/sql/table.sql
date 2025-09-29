-- 1.创建台风信息表

-- 1.1 台风列表
CREATE TABLE public.typhoon_list
(
    id serial NOT NULL,
    name character varying(32) NOT NULL,
    name_en character varying(32) NOT NULL,
    tfbh character varying(12) NOT NULL,
    year bigint NOT NULL,
    is_current boolean NOT NULL,
    land_points character varying(64),
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    PRIMARY KEY (id)
)


-- 1.2 台风实况表
CREATE TABLE public.typhoon_live_info
(
    id serial NOT NULL,
    tfbh character varying(12),
    lon numeric NOT NULL,
    lat numeric NOT NULL,
    wind_speed numeric,
    power numeric,
    wind_level numeric,
    move_speed numeric,
    move_dir character varying(12),
    pass_time time without time zone,
    circle7 character varying(128),
    circle10 character varying(128),
    circle12 character varying(128),
    strong character varying(32),
    PRIMARY KEY (id)
)
--1.3 台风预报表
CREATE TABLE public.typhoon_forc_info
(
    id serial NOT NULL,
    live_id integer NOT NULL,
    lon numeric NOT NULL,
    lat numeric NOT NULL,
    wind_speed numeric,
    power numeric,
    wind_level numeric,
    move_speed numeric,
    move_dir character varying(12),
    pass_time time without time zone,
    circle7 character varying(128),
    circle10 character varying(128),
    chircle12 character varying(128),
    strong character varying(32),
    sets character varying(32),
    PRIMARY KEY (id)
)
-- 1.4 登陆点
CREATE TABLE public.typhoon_lands
(
    id serial NOT NULL,
    tfbh character varying(12) NOT NULL,
    lon numeric NOT NULL,
    lat numeric NOT NULL,
    land_pos character varying(64) NOT NULL,
    land_time time without time zone NOT NULL,
    PRIMARY KEY (id)
)
-- 1.5 预报机构表
CREATE TABLE public.typhoon_forecast_org
(
    id serial NOT NULL,
    name character varying(32) NOT NULL,
    color character varying(32) NOT NULL,
    PRIMARY KEY (id)
)
-- 1.6 台风图例表
CREATE TABLE public.typhoon_legends
(
    id serial NOT NULL,
    label character varying(64),
    value character varying(64),
    color character varying(32),
    PRIMARY KEY (id)
);

