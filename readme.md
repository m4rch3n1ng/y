# About

the @m4rch/y command line interface is a halfway working youtube-downloader designed mostly for mp3.

# Installation
```
$ npm i @m4rch/y -g
```

# Configuration

## path
to set up your path use the command

```
$ y -p "D:/your/path"
```

and be sure to either use a forward slash or to backwards slashes

# use

to use the downloader simply type

```
$ y video_id
```

or

```
$ y video_link
```

and either accept to what is automatically added by the downloader or change that and see the magic happen

# Options

options follow a simple construct: single character options use a single hypen like `-v` and can be concatenated like `-vp`, meaning that both "v" and "p" will be used as options.  
multi-character options use a double hyphen like `--version`.

## video

to download the video in mp4 format use either

```
$ y video_id -v
```

or

```
$ y video_id --video
```

## default

to use default values and skip the validation of, for example title, use

```
$ y video_id -y
```

## path

to use a custom path once use

```
$ y video_id -p "D:/your/path"
```

or

```
$ y video_id --path "D:/your/path"
```

# Commands

## version

to see your current version type

```
$ y -v
```

